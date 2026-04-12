// api/generate-report.js — Daily and Weekly AI fitness reports
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
  if (dailyCount >= 800) return res.status(429).json({ error: 'Daily limit reached. Try tomorrow.' });
  dailyCount++;

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { type, userData } = req.body;
    if (!type || !userData) return res.status(400).json({ error: 'Missing data' });

    const isWeekly = type === 'weekly';
    const userSummary = `User: ${userData.name || 'User'}
Goal: ${userData.goal || 'general fitness'}
Level: ${userData.level || 'beginner'}
Current streak: ${userData.streak || 0} days
Total XP: ${userData.xp || 0}
Today's steps: ${(userData.steps || 0).toLocaleString()}
Today's running: ${userData.runKm || 0} km
Last sleep: ${userData.sleepHours || 0} hours
Today's calories eaten: ${userData.caloriesEaten || 0} kcal
Total workouts completed: ${userData.workoutsCompleted || 0}
Recent foods: ${(userData.recentFoods || []).join(', ') || 'none logged'}
Recent activities: ${(userData.recentActivities || []).join(', ') || 'none'}
Resting heart rate: ${userData.heartRateResting || 'not logged'}
Max heart rate: ${userData.heartRateMax || 'not logged'}
Body measurements: ${JSON.stringify(userData.measurements || {})}`;

    const prompt = isWeekly
      ? `You are a fitness AI coach. Analyze this user's WEEKLY fitness data and generate a comprehensive weekly progress report. Be specific, data-driven, and encouraging.

${userSummary}

Return ONLY a valid JSON object (no markdown, no backticks) with these exact keys:
{
  "summary": "2-3 sentence overview of their week",
  "wins": "3-4 specific achievements as bullet points (use • bullets)",
  "trends": "Patterns observed in their data — what they're doing consistently, what's improving, what's declining (3-4 bullets)",
  "nextWeek": "Specific, actionable focus areas for next week (3-4 bullets)"
}

Be specific. Reference actual numbers from their data. Mention Indian foods if recent foods are Indian. Keep total under 250 words.`
      : `You are a fitness AI coach. Analyze this user's TODAY fitness data and generate a personalized daily report. Be specific, data-driven, and encouraging.

${userSummary}

Return ONLY a valid JSON object (no markdown, no backticks) with these exact keys:
{
  "summary": "2-3 sentence summary of their day",
  "wins": "What they did well today (2-3 bullets with • prefix)",
  "improvements": "Specific areas to improve (2-3 bullets with • prefix)",
  "tomorrow": "Concrete plan for tomorrow (3-4 actionable bullets with • prefix)"
}

Reference their actual numbers. If steps are low, suggest specifics. If sleep is short, give a wind-down tip. Keep total under 200 words.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.5 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message || 'AI error' });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const report = JSON.parse(clean);

    return res.status(200).json({ report });
  } catch (error) {
    console.error('Report error:', error);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
}
