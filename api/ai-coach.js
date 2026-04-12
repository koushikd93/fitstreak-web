// api/ai-coach.js — Gemini AI fitness coach with conversation memory
let userRequests = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit: 20 messages per IP per hour (prevents abuse)
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const userLog = userRequests.get(ip) || [];
  const recentRequests = userLog.filter(t => now - t < 3600000);
  if (recentRequests.length >= 20) {
    return res.status(429).json({ error: 'Hourly limit reached. Try again in an hour.' });
  }
  recentRequests.push(now);
  userRequests.set(ip, recentRequests);

  // Cleanup old entries
  if (userRequests.size > 1000) {
    for (const [k, v] of userRequests.entries()) {
      if (v.every(t => now - t > 3600000)) userRequests.delete(k);
    }
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { message, context, history = [] } = req.body;
    if (!message || message.length > 500) return res.status(400).json({ error: 'Invalid message' });

    // Build conversation with context
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
- If asked about heart rate, sleep tracking, or features the app offers, mention them
- Celebrate streaks and achievements visible in user's data`;

    const messages = [
      ...history.slice(-4).map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: messages,
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message || 'AI error' });

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "I'm here to help! What's your fitness goal?";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('AI Coach error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
