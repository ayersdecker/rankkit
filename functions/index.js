const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const OpenAI = require('openai');

exports.openaiChatProxy = onRequest(
  {
    region: 'us-central1',
    secrets: ['OPENAI_API_KEY']
  },
  async (req, res) => {
    const origin = req.headers.origin || '*';
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.set('Access-Control-Max-Age', '3600');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          error: { message: 'Unauthorized: missing Firebase auth token' }
        });
        return;
      }

      const token = authHeader.replace('Bearer ', '').trim();
      if (!token) {
        res.status(401).json({ error: { message: 'Unauthorized: invalid auth token' } });
        return;
      }

      const admin = require('firebase-admin');
      if (!admin.apps.length) {
        admin.initializeApp();
      }
      await admin.auth().verifyIdToken(token);

      const { prompt } = req.body || {};
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        res.status(400).json({ error: { message: 'Prompt is required' } });
        return;
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        logger.error('OPENAI_API_KEY secret is not configured');
        res.status(500).json({ error: { message: 'Server is not configured' } });
        return;
      }

      const client = new OpenAI({ apiKey });

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "You are an expert ATS resume optimizer. CRITICAL: Always use the candidate's REAL NAME from their resume - never use placeholders like 'John Doe' or 'Jane Smith'. Extract and use their actual name. Always respond with valid JSON."
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const content = completion.choices?.[0]?.message?.content || '';
      res.status(200).json({ content });
    } catch (error) {
      const statusCode = error?.status || error?.statusCode || 500;
      const message = error?.message || 'Failed to process OpenAI request';

      logger.error('openaiChatProxy error', error);

      res.status(statusCode).json({
        error: {
          message
        }
      });
    }
  }
);
