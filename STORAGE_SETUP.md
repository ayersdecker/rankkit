# Firebase Storage Setup

This app now uses Firebase Storage to store original document files (PDFs, DOCX, etc.) in addition to the extracted text content.

## Storage Rules

The `storage.rules` file defines security rules for Firebase Storage. To deploy these rules:

```bash
# If you haven't already, install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init storage

# Deploy storage rules
firebase deploy --only storage
```

## How It Works

1. When a user uploads a file, it's stored in Firebase Storage at:
   ```
   /users/{userId}/documents/{timestamp}_{filename}
   ```

2. The download URL is saved in Firestore along with the extracted text content

3. When viewing a document:
   - PDFs are displayed in an iframe
   - Other files show a download button
   - Users can toggle between the original file and text content

## Rules Summary

- Users can only read/write/delete their own documents
- Files are organized by user ID
- All other access is denied by default
