// api/scan-food.js — Rate-limited Gemini proxy
// FREE TIER LIMITS: 15 req/min, 1,500 req/day, 1M tokens/day
// OUR SAFETY LIMITS: 10 req/min, 1,200 req/day (20% buffer)

// In-memory counters (per serverless instance)
let minuteCount = 0;
let minuteResetTime = Date.now();
let dailyCount = 0;
let dailyResetTime = Date.now();

function checkRateLimit() {
  const now = Date.now();

  // Reset minute counter every 60 seconds
  if (now - minuteResetTime > 60000) {
    minuteCount = 0;
    minuteResetTime = now;
  }

  // Reset daily counter every 24 hours
  if (now - dailyResetTime > 86400000) {
    dailyCount = 0;
    dailyResetTime = now;
  }

  // Check limits (with safety buffer)
  if (minuteCount >= 10) {
    return { limited: true, message: "Too many scans. Please wait 1 minute and try again." };
  }
  if (dailyCount >= 1200) {
    return { limited: true, message: "Daily scan limit reached. Try again tomorrow! You can still add food manually from the database." };
  }

  minuteCount++;
  dailyCount++;
  return { limited: false };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Check rate limits
  const rateCheck = checkRateLimit();
  if (rateCheck.limited) {
    return res.status(429).json({ error: rateCheck.message });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured on server.' });

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    // Reject oversized images (limit to ~1MB base64 = ~750KB image)
    if (imageBase64.length > 1400000) {
      return res.status(400).json({ error: 'Image too large. Please take a closer, smaller photo.' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
              { text: 'Identify every food item visible in this image. For EACH item, estimate nutritional content per typical serving. Return ONLY a JSON array (no markdown, no backticks) where each element has: "name" (string with portion), "cal" (number kcal), "protein" (number g), "carbs" (number g), "fat" (number g), "category" (breakfast/lunch/snack/drink/sweet/fruit), "region" (cuisine origin). Use local Indian/South Asian names when applicable. If no food visible return: [{"name":"No food detected","cal":0,"protein":0,"carbs":0,"fat":0,"category":"snack","region":"N/A"}]' }
            ]
          }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.1
          }
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message || 'Gemini API error' });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    const items = JSON.parse(clean);

    // Return with remaining quota info
    return res.status(200).json({
      items,
      quota: { dailyRemaining: Math.max(0, 1200 - dailyCount), minuteRemaining: Math.max(0, 10 - minuteCount) }
    });
  } catch (error) {
    console.error('Scan error:', error);
    return res.status(500).json({ error: 'Failed to analyze food. Try again.' });
  }
}
