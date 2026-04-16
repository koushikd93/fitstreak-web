// api/analyze-posture.js — OpenAI Vision exercise form/posture analysis
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
  if (dailyCount >= 200) return res.status(429).json({ error: 'Daily analysis limit reached. Try tomorrow.' });
  dailyCount++;

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const { image, mimeType, exerciseName } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

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
            content: `You are an expert fitness coach and biomechanics analyst. Analyze exercise form from photos.

EXERCISE BEING PERFORMED: ${exerciseName || 'Unknown exercise'}

ANALYSIS RULES:
- Look at body alignment, joint angles, posture, and positioning
- Compare to ideal form for the specific exercise
- Be constructive and encouraging — not harsh
- Give specific, actionable corrections (not vague advice)
- Score from 1-10 (1=dangerous, 5=needs work, 7=good, 9=excellent, 10=perfect)
- If the person is NOT doing an exercise or photo is unclear, say so
- Focus on: spine alignment, knee position, shoulder placement, core engagement, head position

COMMON CHECKS BY EXERCISE:
- Push-ups: straight body line, elbow angle, wrist alignment, head neutral
- Squats: knees over toes, depth, back straight, feet shoulder width
- Planks: no hip sag or pike, neutral spine, shoulders over wrists
- Lunges: front knee over ankle, upright torso, back knee near floor
- Deadlifts: flat back, hips hinge, bar close to body

Return ONLY a valid JSON object:
{
  "score": 7,
  "feedback": "Your form looks good overall. Your back is straight and core appears engaged.",
  "corrections": "Try to keep your elbows closer to 45 degrees from your body rather than flared out. Also, tuck your chin slightly to maintain a neutral neck position.",
  "injury_risk": "Low — minor elbow flare increases shoulder strain over time",
  "tip": "Focus on squeezing your glutes at the top of the movement for better activation"
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
                text: `Analyze my form while performing: ${exerciseName || 'this exercise'}. Give me a score out of 10 and specific corrections.`
              }
            ]
          }
        ],
        max_tokens: 400,
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

    if (!result.score && !result.feedback) {
      return res.status(400).json({ error: 'Could not analyze posture. Make sure the photo clearly shows your exercise form.' });
    }

    return res.status(200).json({
      score: Math.min(10, Math.max(1, Math.round(result.score || 5))),
      feedback: result.feedback || 'Analysis complete.',
      corrections: result.corrections || null,
      injury_risk: result.injury_risk || null,
      tip: result.tip || null
    });
  } catch (error) {
    console.error('Posture analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze posture' });
  }
}
