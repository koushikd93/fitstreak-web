// api/analyze-workout.js — AI workout form analysis and tips
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

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

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

Give them a brief post-workout analysis. Return ONLY a JSON object (no markdown):
{
  "encouragement": "1 sentence celebrating their effort",
  "muscles": "What muscles they worked (1 sentence)",
  "tip": "1 specific form/technique tip for next time",
  "progression": "1 specific way to make this harder next time"
}

Keep each field under 25 words. Be specific and actionable.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.5 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(clean);

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
