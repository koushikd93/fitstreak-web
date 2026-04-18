// api/create-order.js — Razorpay: Create an order
// Vercel serverless function (no database, no SDK — pure REST)
//
// Env vars required on Vercel:
//   RAZORPAY_KEY_ID      — Key ID (starts with rzp_test_ or rzp_live_)
//   RAZORPAY_KEY_SECRET  — Key Secret (never exposed to frontend)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!KEY_ID || !KEY_SECRET) {
    return res.status(500).json({
      error: 'Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel env vars.'
    });
  }

  try {
    const { amount, plan } = req.body || {};

    // Validate amount (in paise, minimum 100 = ₹1)
    const amt = parseInt(amount);
    if (!amt || amt < 100) {
      return res.status(400).json({ error: 'Invalid amount. Minimum 100 paise.' });
    }

    // Only allow our known plan amounts to prevent tampering
    // 9900 = ₹99 (monthly), 59900 = ₹599 (yearly)
    if (amt !== 9900 && amt !== 59900) {
      return res.status(400).json({ error: 'Invalid plan amount.' });
    }

    // Authenticate with Razorpay using Basic Auth
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

    // Create order via Razorpay API
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amt,
        currency: 'INR',
        receipt: `fs_${plan || 'sub'}_${Date.now()}`,
        notes: {
          plan: plan || 'unknown',
          app: 'FitStreak'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Razorpay order error:', data);
      if (response.status === 401) {
        return res.status(401).json({ error: 'Razorpay authentication failed. Check your API keys.' });
      }
      return res.status(500).json({
        error: data.error?.description || 'Failed to create order'
      });
    }

    // Return order details to frontend (safe to expose)
    return res.status(200).json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: KEY_ID  // Frontend needs this to open checkout modal
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
