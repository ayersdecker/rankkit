const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    app.use('/api/openai/chat', (req, res) => {
      res.status(500).json({ error: { message: 'Missing REACT_APP_FIREBASE_PROJECT_ID for dev proxy' } });
    });
    return;
  }

  app.use(createProxyMiddleware('/api/openai/chat', {
    target: `https://us-central1-${projectId}.cloudfunctions.net`,
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      '^/api/openai/chat$': '/openaiChatProxy'
    }
  }));
};
