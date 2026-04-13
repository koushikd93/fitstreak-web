// api/analyze-workout.js — OpenAI workout analysis
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
  if (dailyCount >= 500) return res.status(429).json({ error: 'Daily limit reached' });
  dailyCount++;

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const { workoutName, exercises, duration, difficulty, userLevel, userGoal, totalWorkoutsCompleted } = req.body;
    if (!workoutName) return res.status(400).json({ error: 'Missing workout data' });

    const prompt = `You are a fitness AI coach. A user just completed this workout:

Workout: ${workoutName}
Exercises: ${(exercises || []).join(', ')}
Duration: ${duration} minutes
Difficulty: ${difficulty}
User level: ${userLevel || 'beginner'}
User goal: ${userGoal || 'general fitness'}
Total workouts completed: ${totalWorkoutsCompleted || 0}

Give them a brief post-workout analysis. Return ONLY a JSON object:
{
  "encouragement": "1 sentence celebrating their effort",
  "muscles": "What muscles they worked (1 sentence)",
  "tip": "1 specific form/technique tip for next time",
  "progression": "1 specific way to make this harder next time"
}

Keep each field under 25 words. Be specific and actionable.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a fitness coach. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content?.trim() || '{}';
    const analysis = JSON.parse(text);

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
