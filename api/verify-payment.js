// api/verify-payment.js — Razorpay: Verify payment signature
// SECURITY CRITICAL: This endpoint MUST verify the signature before marking
// a user as Pro. Without this, anyone could call it and claim they paid.
//
// How it works:
//   1. Razorpay sends us: order_id, payment_id, signature
//   2. We compute: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
//   3. If our computed hash matches Razorpay's signature → payment is real
//
// Env vars required:
//   RAZORPAY_KEY_SECRET

import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_SECRET) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body || {};

    // Validate all required fields present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Compute expected signature
    // Razorpay formula: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(body)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      console.warn('Signature mismatch:', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Payment verified! 
    // NOTE: In a full production system, you'd also:
    //   1. Save the payment record to a database
    //   2. Send a confirmation email to the user
    //   3. Log for audit trail
    // For FitStreak MVP with localStorage-based user state, the frontend
    // handles marking the user as Pro after receiving this success response.

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification failed'
    });
  }
}
