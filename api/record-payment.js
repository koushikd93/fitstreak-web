// api/record-payment.js — Saves a successful Razorpay payment in the database (Supabase)
//
// Called by the app AFTER /api/verify-payment has already said "success".
// verify-payment.js is NOT changed. This file checks the Razorpay signature again on its own,
// so nobody can insert a fake payment row.
//
// POST { razorpay_order_id, razorpay_payment_id, razorpay_signature, deviceId, plan }
// Env vars needed in Vercel: RAZORPAY_KEY_SECRET (already there), SUPABASE_URL, SUPABASE_SECRET_KEY

import crypto from 'crypto';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sbHeaders(key) {
  const h = { apikey: key, 'Content-Type': 'application/json' };
  if (!key.startsWith('sb_')) h.Authorization = `Bearer ${key}`;
  return h;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SECRET = process.env.RAZORPAY_KEY_SECRET;
  // Strip spaces/line breaks that sneak in when the key is pasted into Vercel
  const SB_URL = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const SB_KEY = (process.env.SUPABASE_SECRET_KEY || '').replace(/\s+/g, '');
  if (!SECRET || !SB_URL || !SB_KEY) return res.status(500).json({ error: 'Not configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, deviceId, plan } = body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' });
  }

  // Same check Razorpay documents: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const cleanPlan = plan === 'monthly' || plan === 'yearly' ? plan : null;
  const row = {
    razorpay_payment_id: String(razorpay_payment_id).slice(0, 64),
    razorpay_order_id: String(razorpay_order_id).slice(0, 64),
    device_id: UUID_RE.test(String(deviceId || '')) ? String(deviceId).toLowerCase() : null,
    plan: cleanPlan,
    amount_paise: cleanPlan === 'monthly' ? 9900 : cleanPlan === 'yearly' ? 59900 : null,
  };

  try {
    const r = await fetch(`${SB_URL}/rest/v1/payments?on_conflict=razorpay_payment_id`, {
      method: 'POST',
      headers: { ...sbHeaders(SB_KEY), Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      console.error('record-payment failed', r.status, await r.text());
      return res.status(502).json({ error: 'Could not record payment' });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    // Log only the error type: some errors contain request headers (the secret key)
    console.error('record-payment error:', (err && err.name) || 'Error');
    return res.status(500).json({ error: 'Server error' });
  }
}
