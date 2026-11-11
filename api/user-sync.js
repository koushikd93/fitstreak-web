// api/user-sync.js — Cloud backup for FitStreak (Supabase)
//
// POST { action:"save", deviceId, appVersion, name, data }  -> saves this phone's progress
// POST { action:"restore", deviceId }                        -> returns a backup + whether that code has a verified payment
//
// The app NEVER talks to Supabase directly. Only this server file does, using the secret key
// stored in Vercel env vars:  SUPABASE_URL  and  SUPABASE_SECRET_KEY
// The "deviceId" is a random backup code (UUID) created on each phone. Whoever has the code
// can read/overwrite that backup, so users must keep it private.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CHARS = 500000; // ~500 KB per user backup

let dailyCount = 0;
let dailyReset = Date.now();

function sbHeaders(key) {
  // New Supabase keys (sb_secret_...) go only in the apikey header.
  // Old-style service_role JWT keys also need the Authorization header.
  const h = { apikey: key, 'Content-Type': 'application/json' };
  if (!key.startsWith('sb_')) h.Authorization = `Bearer ${key}`;
  return h;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const now = Date.now();
  if (now - dailyReset > 86400000) { dailyCount = 0; dailyReset = now; }
  if (dailyCount >= 20000) return res.status(429).json({ error: 'Daily limit' });
  dailyCount++;

  // Strip spaces/line breaks that sneak in when the key is pasted into Vercel
  const SB_URL = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const SB_KEY = (process.env.SUPABASE_SECRET_KEY || '').replace(/\s+/g, '');
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Cloud backup not configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const deviceId = String(body.deviceId || '').toLowerCase();
  if (!UUID_RE.test(deviceId)) return res.status(400).json({ error: 'Invalid backup code' });

  const headers = sbHeaders(SB_KEY);

  try {
    // ── SAVE ──
    if (body.action === 'save') {
      const data = body.data && typeof body.data === 'object' ? body.data : {};
      if (JSON.stringify(data).length > MAX_CHARS) return res.status(413).json({ error: 'Backup too large' });
      const ts = new Date().toISOString();
      const row = {
        device_id: deviceId,
        name: String(body.name || '').slice(0, 60),
        app_version: String(body.appVersion || '').slice(0, 20),
        data,
        updated_at: ts,
        last_seen_at: ts,
      };
      const r = await fetch(`${SB_URL}/rest/v1/users?on_conflict=device_id`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(row),
      });
      if (!r.ok) {
        console.error('user-sync save failed', r.status, await r.text());
        return res.status(502).json({ error: 'Save failed' });
      }
      return res.status(200).json({ success: true, savedAt: ts });
    }

    // ── RESTORE ──
    if (body.action === 'restore') {
      const r = await fetch(
        `${SB_URL}/rest/v1/users?device_id=eq.${deviceId}&select=data,name,updated_at`,
        { headers }
      );
      if (!r.ok) {
        console.error('user-sync restore failed', r.status, await r.text());
        return res.status(502).json({ error: 'Restore failed. Try again.' });
      }
      const rows = await r.json();
      if (!rows.length) return res.status(404).json({ error: 'No backup found for this code.' });

      // Pro is restored ONLY from a server-verified Razorpay payment, never from the backup itself
      let pro = false, proPlan = null;
      const p = await fetch(
        `${SB_URL}/rest/v1/payments?device_id=eq.${deviceId}&select=plan,created_at&order=created_at.desc&limit=1`,
        { headers }
      );
      if (p.ok) {
        const pays = await p.json();
        if (pays.length) { pro = true; proPlan = pays[0].plan || null; }
      }

      return res.status(200).json({
        success: true,
        name: rows[0].name || '',
        updatedAt: rows[0].updated_at,
        data: rows[0].data || {},
        pro,
        proPlan,
      });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    // Log only the error type: some errors contain request headers (the secret key)
    console.error('user-sync error:', (err && err.name) || 'Error');
    return res.status(500).json({ error: 'Server error' });
  }
}
