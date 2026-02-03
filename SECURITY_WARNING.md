# ⚠️ CRITICAL SECURITY ISSUE

## API Key Exposed in Frontend

**Current Status**: The OpenAI API key is currently imported and used directly in the browser (frontend React app).

**Risk**: Anyone can open browser DevTools → Network tab → see your API key in request headers → steal it and rack up charges on your OpenAI account.

## Immediate Action Required

You **must** move the OpenAI API calls to a backend server. The correct architecture is:

```
Browser → Your Backend API → OpenAI API
```

### Recommended Fix: Add a Backend Proxy

#### Option 1: Node.js/Express Backend (Simplest)

1. Create `/server/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/optimize', async (req, res) => {
  const { prompt } = req.body;
  
  // Check user authentication (Firebase token)
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Verify Firebase token
    const token = authHeader.replace('Bearer ', '');
    // await admin.auth().verifyIdToken(token);
    
    // Make OpenAI request server-side
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('API server running on :3001'));
```

2. Update frontend to call your backend:
```typescript
// Instead of calling OpenAI directly:
const response = await axios.post('/api/optimize', { prompt });
```

#### Option 2: Firebase Cloud Functions

Even better - use Firebase Cloud Functions since you're already using Firebase:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

exports.optimizeContent = functions.https.onCall(async (data, context) => {
  // Authentication is automatic with onCall
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  const { prompt } = data;
  
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: {
      'Authorization': `Bearer ${functions.config().openai.key}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
});
```

Frontend:
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const optimizeContent = httpsCallable(functions, 'optimizeContent');

const result = await optimizeContent({ prompt });
```

#### Option 3: Next.js API Routes (if migrating to Next.js)

```typescript
// pages/api/optimize.ts
export default async function handler(req, res) {
  // API key stays on server
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
  });
  // ...
}
```

## Additional Benefits of Backend Proxy

1. **Rate Limiting per User**: Enforce limits in your backend
2. **Cost Control**: Track usage per user, implement quotas
3. **Monitoring**: Log all requests for debugging
4. **Caching**: Server-side cache to reduce OpenAI calls
5. **Security**: Validate requests before hitting OpenAI

## Current Status

Until you implement a backend proxy, your API key is vulnerable. Anyone viewing your site can extract it and use it for their own purposes, potentially costing you money.

**Priority**: HIGH - Implement ASAP before public launch.
