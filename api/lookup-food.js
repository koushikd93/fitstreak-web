// api/lookup-food.js — Gemini text-based calorie lookup (1/user/day)

let minuteCount = 0;
let minuteReset = Date.now();
let dailyCount = 0;
let dailyReset = Date.now();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const now = Date.now();
  if (now - minuteReset > 60000) { minuteCount = 0; minuteReset = now; }
  if (now - dailyReset > 86400000) { dailyCount = 0; dailyReset = now; }
  if (minuteCount >= 10) return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });
  if (dailyCount >= 500) return res.status(429).json({ error: 'Daily limit reached. Try tomorrow.' });
  minuteCount++;
  dailyCount++;

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { foodName } = req.body;
    if (!foodName || foodName.length < 2) return res.status(400).json({ error: 'Enter a food name' });
    if (foodName.length > 100) return res.status(400).json({ error: 'Food name too long' });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a nutrition database. The user ate: "${foodName}". Return ONLY a single JSON object (no markdown, no backticks, no explanation, no extra text) with these exact keys: "name" (string, the food with portion), "cal" (integer, total kcal), "protein" (integer, grams), "carbs" (integer, grams), "fat" (integer, grams), "category" (one of: breakfast, lunch, snack, drink, sweet, fruit), "region" (cuisine origin string like "North India", "South India", "Pan India", "Chinese", "Italian" etc). Be accurate with calorie estimates. If the food includes a weight (like "200g"), calculate for that weight. If no weight given, use a standard single serving. Return ONLY the JSON object.`
            }]
          }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.1 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message || 'Gemini error' });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const item = JSON.parse(clean);

    if (!item.name || !item.cal) return res.status(400).json({ error: 'Could not determine calories. Try being more specific.' });

    return res.status(200).json({ item });
  } catch (error) {
    console.error('Lookup error:', error);
    return res.status(500).json({ error: 'Lookup failed. Try again.' });
  }
}
