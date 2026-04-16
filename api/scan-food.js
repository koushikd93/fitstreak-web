// api/scan-food.js — OpenAI Vision food photo → calorie analysis
let dailyCount = 0;
let dailyReset = Date.now();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const now = Date.now();
  if (now - dailyReset > 86400000) { dailyCount = 0; dailyReset = now; }
  if (dailyCount >= 300) return res.status(429).json({ error: 'Daily scan limit reached. Try tomorrow.' });
  dailyCount++;

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const { image, mimeType } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    // Limit image size (base64 ~1.37x raw, so 4MB base64 ≈ 3MB image)
    if (image.length > 4 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large. Use a smaller photo.' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a nutrition expert AI. Analyze food photos and estimate calories and macronutrients.

RULES:
- Identify the food item(s) in the photo
- Estimate portion size from visual cues (plate size, utensils, hand for scale)
- Provide calorie and macronutrient estimates per the visible portion
- If multiple items visible, combine them into one entry with total calories
- For Indian foods, use accurate nutrition data (dal, roti, rice, sabzi, etc.)
- Be conservative — slightly overestimate rather than underestimate calories
- If the image is not food, say so

Return ONLY a valid JSON object:
{
  "name": "Food name (e.g. 'Dal Rice with Roti')",
  "portion": "Estimated portion (e.g. '1 plate, ~350g')",
  "cal": 450,
  "protein": 15,
  "carbs": 60,
  "fat": 12,
  "confidence": "high/medium/low",
  "notes": "Brief note about the estimate"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${image}`,
                  detail: 'low'
                }
              },
              {
                type: 'text',
                text: 'Analyze this food photo. Estimate calories and macros for the visible portion.'
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error('OpenAI Vision error:', data.error);
      return res.status(400).json({ error: data.error.message || 'Could not analyze image' });
    }

    const text = data.choices?.[0]?.message?.content?.trim() || '{}';
    const result = JSON.parse(text);

    // Validate required fields
    if (!result.name || !result.cal) {
      return res.status(400).json({ error: 'Could not identify food in this image. Try a clearer photo.' });
    }

    return res.status(200).json({
      name: result.name,
      portion: result.portion || 'estimated',
      cal: Math.round(result.cal),
      protein: Math.round(result.protein || 0),
      carbs: Math.round(result.carbs || 0),
      fat: Math.round(result.fat || 0),
      confidence: result.confidence || 'medium',
      notes: result.notes || ''
    });
  } catch (error) {
    console.error('Food scan error:', error);
    return res.status(500).json({ error: 'Failed to analyze food photo' });
  }
}
