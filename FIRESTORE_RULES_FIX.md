# Firebase Firestore Security Rules Setup

## The Issue
You're getting "Failed to create document" errors because Firebase Firestore security rules are blocking writes to the database.

## Quick Fix - Deploy Security Rules

### Option 1: Using Firebase Console (Easiest)
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab at the top
5. Replace the existing rules with the content from `firestore.rules` file
6. Click "Publish"

### Option 2: Using Firebase CLI
```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in this project (if not already done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

## What the Rules Do
The `firestore.rules` file contains security rules that:
- Allow authenticated users to read/write their own user data
- Allow authenticated users to create/read/update/delete their own documents
- Allow authenticated users to manage their own optimization versions
- Block all unauthorized access

## Testing
After deploying the rules:
1. Refresh your application
2. Make sure you're logged in with: eclipse12895@gmail.com or ayersdecker@gmail.com
3. Try optimizing a resume
4. Click "Save to Documents"
5. Should work now! ✅

## Temporary Development Rules (NOT FOR PRODUCTION)
If you need to test quickly and don't care about security temporarily:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Warning**: These rules allow ANY authenticated user to read/write EVERYTHING. Only use for local development/testing!
