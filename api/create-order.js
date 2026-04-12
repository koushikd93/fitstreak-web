// api/create-order.js — Razorpay order creation
// Required env vars on Vercel:
//   RAZORPAY_KEY_ID = your Razorpay key ID
//   RAZORPAY_KEY_SECRET = your Razorpay key secret
//
// Setup steps:
//   1. Create Razorpay account at razorpay.com
//   2. Complete KYC (PAN, bank account)
//   3. Get API keys from Dashboard > Settings > API Keys
//   4. Add both keys to Vercel: Settings > Environment Variables
//   5. Set RAZORPAY_ENABLED=true in your App.jsx

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
    const { amount, plan } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    // ₹99 = 9900, ₹599 = 59900
    const validAmounts = [9900, 59900];
    if (!validAmounts.includes(amount)) {
      return res.status(400).json({ error: 'Invalid plan amount' });
    }

    // Create order via Razorpay API
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `fs_${plan}_${Date.now()}`,
        notes: {
          plan,
          app: 'FitStreak'
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error('Razorpay error:', data.error);
      return res.status(400).json({ error: data.error.description || 'Order creation failed' });
    }

    return res.status(200).json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      key: KEY_ID
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}
