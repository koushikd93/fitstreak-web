// api/generate-report.js — OpenAI Daily/Weekly fitness reports
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
  "trends": "Patterns observed in their data (3-4 bullets with •)",
  "nextWeek": "Specific, actionable focus areas for next week (3-4 bullets with •)"
}

Be specific. Reference actual numbers. Mention Indian foods if recent foods are Indian. Keep total under 250 words.`
      : `You are a fitness AI coach. Analyze this user's TODAY fitness data and generate a personalized daily report. Be specific, data-driven, and encouraging.

${userSummary}

Return ONLY a valid JSON object (no markdown, no backticks) with these exact keys:
{
  "summary": "2-3 sentence summary of their day",
  "wins": "What they did well today (2-3 bullets with • prefix)",
  "improvements": "Specific areas to improve (2-3 bullets with • prefix)",
  "tomorrow": "Concrete plan for tomorrow (3-4 actionable bullets with • prefix)"
}

Reference their actual numbers. Keep total under 200 words.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a fitness AI coach. Always return valid JSON when requested.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content?.trim() || '{}';
    const report = JSON.parse(text);

    return res.status(200).json({ report });
  } catch (error) {
    console.error('Report error:', error);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
}
