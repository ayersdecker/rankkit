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
3. Copy it for the functions secret step

### 3. Add Your Credentials
Set your `REACT_APP_FIREBASE_*` values in the ignored `.env.local` file in the
project root. Get them from Firebase Console, Project settings, Your apps, Web app
configuration. The required settings are API key, auth domain, project ID, and app
ID; also configure storage and messaging for those services. The tracked
`.env.example` lists the available variables but contains placeholders, not working
credentials. `.env.local` overrides `.env`, so do not leave empty values in it
when relying on `.env`. Restart `npm start` after changing environment variables.

### 4. Set OpenAI Secret (server-side)
```bash
firebase functions:secrets:set OPENAI_API_KEY
```

### 5. Configure Subscriptions

Free accounts can create, upload, view, download, and manage one document. AI
tools, tool dashboards, optimization, and AI search require an active subscription
for the relevant category. Paid accounts can save up to 30 documents. Verified
developer emails configured in the client and server retain access. There are no
free AI optimizations. Document-count limits are currently checked by the client;
the AI subscription check runs on the server.

1. In Stripe, start in **test mode** and create monthly recurring USD prices:
   Career $7.99, Workplace $12.99, Social $12.99, Pro Bundle $19.99, and Ultimate
   Bundle $24.99. Pro includes Workplace and Social; Ultimate includes all tools.
2. Create `functions/.env.<firebase-project-id>` with non-secret configuration:

   ```dotenv
   APP_URL=https://www.rankkit.net
   STRIPE_PRICE_CAREER=price_replace_me
   STRIPE_PRICE_WORK=price_replace_me
   STRIPE_PRICE_SOCIAL=price_replace_me
   STRIPE_PRICE_PRO_BUNDLE=price_replace_me
   STRIPE_PRICE_ULTIMATE_BUNDLE=price_replace_me
   ```

3. Store secrets using the Firebase CLI prompts. Never put Stripe secrets in a
   `REACT_APP_*` variable or commit them:

   ```bash
   firebase functions:secrets:set STRIPE_SECRET_KEY
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   npm ci --prefix functions
   ```

4. Register the Stripe webhook destination at
   `https://us-central1-<firebase-project-id>.cloudfunctions.net/stripeWebhook`.
   Subscribe to `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, and `customer.subscription.deleted`. Use that
   destination's signing secret for `STRIPE_WEBHOOK_SECRET`.
5. Activate the Stripe customer portal. Enable payment-method updates, cancellation,
   and plan changes among these configured prices. Existing customers use **Manage
   Subscription** rather than creating a second subscription.
6. The client uses `REACT_APP_FIREBASE_PROJECT_ID` to locate the billing functions.
   Optionally set `REACT_APP_BILLING_API_URL` to their base URL. For local emulator
   testing, point it at the emulator's project/region URL and set the backend
   `APP_URL` to `http://localhost:3000` in an untracked emulator environment file.

Only signed webhooks update billing access. A checkout redirect does not grant
access. Subscription changes stream to the signed-in client; unpaid, past-due,
canceled, unknown-price, and expired-period subscriptions deny access. Cancellation
at the end of a period retains access while Stripe reports the subscription active.
The webhook retrieves current Stripe state so repeated events do not blindly
restore outdated status. Firestore rules prevent users from editing billing fields.

Before launch, test successful checkout, declined/abandoned payment, renewal,
plan change, period-end cancellation, failed renewal, webhook replay, and attempts
to edit billing fields with the Firestore emulator. Confirm that free accounts
can still manage their document and cannot open a paid tool or call the AI proxy.
Use Stripe test credentials for this checklist, then replace all prices and secrets
with their live-mode equivalents. Firebase functions require a billing-enabled
Firebase project. Monitor failed webhook deliveries and Stripe billing events.
Existing beta profiles with `isPremium` alone no longer grant access; migrate any
real subscriptions through trusted server updates containing a known plan, active
status, and a future `subscriptionValidUntil` epoch timestamp in milliseconds.

### 6. Deploy Functions, Rules, and Hosting
```bash
npm run build
firebase deploy --only functions,firestore:rules,hosting
```

### 7. Run the App
```bash
cd /workspaces/rankkit
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
- Free document management; AI tools require a category subscription
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

1. **Configure and test Stripe payments using the checklist above**
2. **Save optimizations to Firestore**
3. **Build landing page**
4. **Deploy to Firebase Hosting**

## 💾 Current State
- Code is ready to run
- Need Firebase + OpenAI credentials
- All UI components built
- Basic functionality working

---

**When you're back, just:**
1. Set up Firebase project (10 min)
2. Get OpenAI API key (2 min)
3. Set `OPENAI_API_KEY` functions secret (1 min)
4. Run `npm start`

Then we can test it and iterate. 💙
