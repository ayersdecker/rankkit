# RankKit - Setup Instructions

Project initialized! Here's what's been built:

## ✅ Completed
- Project structure created
- Firebase integration ready
- OpenAI API service configured
- Authentication flow (Email + Google)
- Dashboard UI
- ResumeRank module (resume optimizer)
- PostRank module (social post optimizer)
- Basic styling

## 🔧 What You Need to Do

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create new project "RankKit"
3. Enable Authentication:
   - Email/Password
   - Google Sign-In
4. Create Firestore database (start in production mode)
5. Get your Firebase config from Project Settings

### 2. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy it for the next step

### 3. Add Your Credentials
Edit `/src/config.ts` and replace placeholders:
```typescript
export const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const OPENAI_API_KEY = "sk-...YOUR_OPENAI_KEY";
```

### 4. Run the App
```bash
cd /Users/deckerayers/rankkit
npm start
```

The app will open at http://localhost:3000

## 📋 What's Built

### Authentication
- `/login` - Email + Google sign-in
- `/signup` - Create account
- Protected routes (redirects to login if not authenticated)

### Dashboard
- `/dashboard` - Main hub showing both tools
- Usage tracking (free tier: 3 optimizations)
- Upgrade prompts

### ResumeRank
- `/resume` - Resume optimizer
- Paste job posting + resume
- Get ATS match score + optimized version
- See key improvements

### PostRank
- `/post` - Social media post optimizer
- Select platform (IG/TikTok/YouTube/Twitter)
- Paste caption
- Get engagement score + optimized version + hashtags

## 🚀 Next Steps (After Testing)

1. **Add Stripe for payments**
2. **Save optimizations to Firestore**
3. **Build landing page**
4. **Deploy to GitHub Pages**

## 💾 Current State
- Code is ready to run
- Need Firebase + OpenAI credentials
- All UI components built
- Basic functionality working

---

**When you're back, just:**
1. Set up Firebase project (10 min)
2. Get OpenAI API key (2 min)
3. Update config.ts (1 min)
4. Run `npm start`

Then we can test it and iterate. 💙
