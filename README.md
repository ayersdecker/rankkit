# RankKit - AI-Powered Content Optimization Platform

RankKit is a comprehensive AI-powered SaaS platform that optimizes content across three key areas: **Career Tools** (resumes, cover letters, interview prep, job search), **Workplace Tools** (cold emails, sales scripts, selling points, persuasion tactics), and **Social Media Tools** (Instagram, TikTok, YouTube, Twitter optimization). Features include intelligent content analysis, ATS optimization, engagement scoring, document management, version history, and export functionality.

---

## 🚀 MVP Roadmap (Ready for Launch!)

### 🔴 Critical (Must-Have)
- [ ] **Payment Integration** - Stripe setup for premium subscriptions
- [ ] **Premium Tier Enforcement** - Enforce usage limits per subscription plan
- [ ] **Email Verification** - Verify email addresses on signup
- [x] **Legal Pages** - Privacy Policy, Terms of Service
- [ ] **Edge Case Testing** - Test with various document types/sizes
- [ ] **Security Audit** - Review API keys, permissions, data access

### 🟡 High Priority (Should-Have)
- [ ] **User Onboarding** - Welcome flow for new users
- [ ] **Help Documentation** - In-app help & FAQ
- [x] **Mobile Responsiveness** - Full mobile testing & optimization
- [x] **Performance Testing** - Load testing & optimization
- [ ] **Bug Fixes** - QA testing & fix remaining issues
- [x] **Monitoring Setup** - Error tracking & analytics

### 🟢 Nice-to-Have (Could-Have)
- [x] **Analytics Dashboard** - Track user behavior & engagement
- [ ] **User Feedback System** - In-app feedback/surveys
- [ ] **Email Notifications** - Send alerts for subscription/usage
- [ ] **Accessibility** - WCAG compliance improvements
- [ ] **Dark Mode** - Dark theme support
- [x] **Export PDF/DOCX** - Advanced document export

### ✅ Already Complete
- ✅ 11 AI-powered tools with save-to-documents
- ✅ Document management system
- ✅ User authentication (Email + Google)
- ✅ User profiles with bio
- ✅ Responsive design
- ✅ Error boundaries & error handling
- ✅ Request caching & optimization
- ✅ Version history tracking

---

## Features

### Document Management
- 📤 Upload documents (TXT, PDF, DOCX) or paste text
- 📁 Organize documents by type (resume, post, other)
- 📝 Edit and manage all documents in one place
- 🗑️ Delete documents with cascade deletion of versions

### AI Optimization Capabilities

#### Career Tools
- 🎯 **Resume Optimization** - Match resumes to job postings with ATS scoring
- ✉️ **Cover Letter Generation** - Create personalized cover letters
- 💼 **Interview Prep** - Get questions, answers, and preparation strategies
- 🔍 **Job Search Assistant** - Strategic guidance for job applications

#### Workplace Tools
- 📧 **Cold Email Generator** - Craft compelling outreach emails
- 💬 **Sales Script Builder** - Generate persuasive sales conversations
- 💡 **Selling Points Finder** - Extract key value propositions
- 🎯 **Persuasion Tactics** - Apply proven influence techniques
- 📝 **Professional Writing** - Negotiate, apologize, and communicate effectively

#### Social Media Tools
- 📱 **Multi-Platform Optimization** - Instagram, TikTok, YouTube, Twitter/X
- #️⃣ **Hashtag Generation** - Smart hashtag recommendations
- 📊 **Engagement Scoring** - Predict and maximize engagement (0-100)
- 💡 **Content Enhancement** - AI-powered improvement suggestions
- 🎨 **Platform-Specific Strategies** - Tailored optimization for each platform

### Version Control
- 📜 Track all optimization versions
- 🔄 Compare original vs optimized side-by-side
- 💾 Auto-save every optimization
- 📈 View version history per document

### Export & Save
- 📋 Copy to clipboard
- 💾 Export as .txt files
- 🔄 Save optimized versions to library

### User Experience
- 🎨 Clean, modern interface
- 📱 Fully responsive design
- ⚡ Fast, optimized performance
- 🔒 Secure authentication (Email + Google)
- 🚨 Error boundaries with graceful fallbacks
- ♻️ Request caching for better performance

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Routing:** React Router 7
- **Backend:** Firebase (Auth + Firestore)
- **AI:** OpenAI GPT-4
- **Styling:** Custom CSS
- **Testing:** Jest, React Testing Library
- **Deployment:** GitHub Actions → GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayersdecker/rankkit.git
   cd rankkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project "RankKit"
   - Enable Authentication:
     - Email/Password
     - Google Sign-In
   - Create Firestore database (production mode)
   - Get your Firebase config from Project Settings

4. **Get OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create new API key
   - Copy the key

5. **Configure Environment**
   
   Edit `src/config.ts`:
   ```typescript
   export const firebaseConfig = {
     apiKey: "YOUR_FIREBASE_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   export const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
   ```

6. **Run Development Server**
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### Running Tests

```bash
npm test
```

For coverage report:
```bash
npm test -- --coverage
```

## Project Structure

```
rankkit/
├── src/
│   ├── components/
│   │   ├── Auth/              # Login & Signup
│   │   ├── Dashboard/         # Main dashboard, documents, optimization, profile
│   │   └── Shared/            # Reusable components (ErrorBoundary, Loading)
│   ├── services/
│   │   ├── firebase.ts        # Firebase initialization
│   │   ├── firestore.ts       # Firestore CRUD operations
│   │   └── openai.ts          # OpenAI API integration
│   ├── hooks/
│   │   └── useAuth.tsx        # Authentication hook
│   ├── utils/
│   │   └── fileUtils.ts       # File handling utilities
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── App.tsx                # Main app component
│   └── config.ts              # Configuration
├── public/                    # Static assets
└── package.json
```

## Key Services

### OpenAI Service (`src/services/openai.ts`)
- ✅ Input validation
- ✅ Retry logic with exponential backoff
- ✅ Request caching (5 min TTL)
- ✅ Error handling with custom error types
- ✅ Score clamping (0-100)
- ✅ 30-second timeout
- ✅ Rate limit handling

### Firestore Service (`src/services/firestore.ts`)
- ✅ CRUD operations for documents
- ✅ Version history management
- ✅ Batch deletion (cascade delete)
- ✅ Input validation
- ✅ User statistics
- ✅ Usage count tracking
- ✅ Custom error types
- ✅ Logging

## Deployment

### GitHub Pages (Automatic)

1. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: "GitHub Actions"

2. **Push to main branch**
   ```bash
   git push origin main
   ```

3. **Access your site**
   - https://ayersdecker.github.io/rankkit

The GitHub Actions workflow automatically builds and deploys on every push to main.

## Usage Limits

### Free Tier
- 3 optimizations per month
- Unlimited document storage
- All features included

### Premium Plans
- **ResumeRank:** $25/month - Unlimited resume optimizations
- **PostRank:** $20/month - Unlimited post optimizations
- **Bundle:** $35/month - Both tools + save $10/month

## Error Handling

- **API Errors:** Graceful error messages with retry logic
- **Validation Errors:** Clear, actionable error messages
- **Network Errors:** Automatic retry with exponential backoff
- **UI Errors:** Error boundaries prevent app crashes
- **Rate Limits:** User-friendly messages with guidance

## Performance Optimizations

- ✅ Request caching (5-minute TTL)
- ✅ Lazy loading of components
- ✅ Optimized Firebase queries
- ✅ Batch operations for deletions
- ✅ Debounced search/filter operations
- ✅ CSS optimizations

## Security

- ✅ Firebase Authentication (Email + Google)
- ✅ Protected routes
- ✅ User-scoped data access
- ✅ Input validation and sanitization
- ✅ Content length limits
- ✅ API key protection (server-side recommended for production)

## Future Enhancements

- [ ] PDF/DOCX parsing (add `pdf-parse` and `mammoth`)
- [ ] Export as PDF/DOCX
- [ ] Stripe payment integration
- [ ] A/B testing for social posts
- [ ] Analytics dashboard
- [ ] Team collaboration
- [ ] Scheduled optimizations
- [ ] Multi-language support
- [ ] Dark mode

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is private and proprietary.

## Support

For issues or questions, contact: ayersdecker@gmail.com

---

**Built with ❤️ by Decker Ayers**
