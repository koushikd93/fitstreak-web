// api/ai-coach.js — OpenAI GPT-4o-mini AI fitness coach
let userRequests = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit: 20 messages per IP per hour
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const userLog = userRequests.get(ip) || [];
  const recentRequests = userLog.filter(t => now - t < 3600000);
  if (recentRequests.length >= 20) {
    return res.status(429).json({ error: 'Hourly limit reached. Try again in an hour.' });
  }
  recentRequests.push(now);
  userRequests.set(ip, recentRequests);

  if (userRequests.size > 1000) {
    for (const [k, v] of userRequests.entries()) {
      if (v.every(t => now - t > 3600000)) userRequests.delete(k);
    }
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI API key not configured. Add OPENAI_API_KEY in Vercel env vars.' });

  try {
    const { message, context, history = [] } = req.body;
    if (!message || message.length > 500) return res.status(400).json({ error: 'Invalid message' });

    const systemPrompt = `You are FitCoach, a friendly and knowledgeable AI fitness coach for the FitStreak app. You help users with fitness, nutrition, workouts, recovery, and motivation.

${context}

GUIDELINES:
- Keep responses SHORT (2-4 sentences max, like a friend texting)
- Be encouraging and motivational
- Give specific, actionable advice based on the user's data above
- Use simple language, avoid jargon
- Include 1 emoji max per response
- For Indian users, mention Indian foods and exercises when relevant
- Never give medical advice — suggest consulting a doctor for health issues
- Celebrate streaks and achievements visible in user's data`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message || 'OpenAI error' });

    const reply = data.choices?.[0]?.message?.content?.trim() || "I'm here to help! What's your fitness goal?";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('AI Coach error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
