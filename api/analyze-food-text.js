// api/analyze-food-text.js — OpenAI text-based food calorie estimator
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
  if (dailyCount >= 500) return res.status(429).json({ error: 'Daily limit reached. Try tomorrow.' });
  dailyCount++;

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const { foodName, quantity } = req.body;
    if (!foodName || typeof foodName !== 'string') {
      return res.status(400).json({ error: 'Food name is required' });
    }
    if (foodName.length > 200) {
      return res.status(400).json({ error: 'Food name too long' });
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
            content: `You are a nutrition expert specializing in Indian and South Asian cuisine. Calculate calories and macros from food descriptions.

RULES:
- Identify the food (Indian dishes: dal, roti, sabzi, biryani, dosa, idli, paratha, etc.)
- Use the quantity provided to estimate portion size accurately
- For ambiguous quantities (e.g., "1 plate"), assume standard Indian portions
- Be slightly conservative (round up calories) to discourage underestimation
- Reject if input is gibberish or not food

Standard Indian portions for reference:
- 1 roti/chapati = 70-80 kcal
- 1 plate dal-rice = 350-450 kcal
- 1 cup dal = 150-200 kcal
- 1 paratha (plain) = 120-150 kcal
- 1 paratha (aloo) = 200-250 kcal
- 1 plate biryani = 500-700 kcal
- 1 idli = 35-40 kcal
- 1 dosa (plain) = 120-150 kcal
- 1 samosa = 250-300 kcal

Return ONLY valid JSON:
{
  "name": "Cleaned food name (e.g. 'Dal Rice with Roti')",
  "portion": "Confirmed portion (e.g. '1 plate, ~350g')",
  "cal": 450,
  "protein": 15,
  "carbs": 60,
  "fat": 12,
  "confidence": "high/medium/low"
}

If input is not food or invalid, return:
{"error": "Could not identify this as food"}`
          },
          {
            role: 'user',
            content: `Food: ${foodName}\nQuantity: ${quantity || '1 standard serving'}\n\nCalculate calories and macros.`
          }
        ],
        max_tokens: 250,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error('OpenAI error:', data.error);
      return res.status(400).json({ error: data.error.message || 'Could not analyze food' });
    }

    const text = data.choices?.[0]?.message?.content?.trim() || '{}';
    const result = JSON.parse(text);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    if (!result.name || !result.cal) {
      return res.status(400).json({ error: 'Could not determine calories. Try being more specific.' });
    }

    return res.status(200).json({
      name: result.name,
      portion: result.portion || quantity || 'estimated',
      cal: Math.round(result.cal),
      protein: Math.round(result.protein || 0),
      carbs: Math.round(result.carbs || 0),
      fat: Math.round(result.fat || 0),
      confidence: result.confidence || 'medium'
    });
  } catch (error) {
    console.error('Food text analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze food' });
  }
}
