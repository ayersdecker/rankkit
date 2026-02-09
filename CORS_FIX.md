# Firebase Storage CORS Fix

## Problem
Firebase Storage URLs were being blocked by CORS policy when accessed directly:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' has been blocked by CORS policy
```

This happened in two places:
1. **During upload** - When calling `getDownloadURL()` after uploading
2. **During viewing** - When loading files in iframes or download links

## Root Cause
Firebase Storage enforces authentication and CORS policies. Direct URL access doesn't include proper authentication tokens, causing:
- CORS preflight failures (OPTIONS request fails)
- 403/500 errors
- Files unable to load  
- Particularly problematic in GitHub Codespaces and dev containers

## Solution
We now use a **path-based approach** instead of storing full URLs:

### 1. Upload Process
- ✅ Upload file to Firebase Storage
- ✅ Store the **storage path** (e.g., `users/{uid}/documents/file.pdf`) in Firestore
- ❌ ~~Store download URL~~ (causes CORS errors)

### 2. View/Download Process
- ✅ Use Firebase SDK's `getBlob()` with authentication
- ✅ Create temporary blob URLs (e.g., `blob://...`)
- ✅ Use blob URLs in iframes and download links
- ✅ Clean up blob URLs when done

### Code Changes

#### 1. Updated `uploadDocumentFile()` ([firestore.ts](src/services/firestore.ts#L57-L90))
```typescript
// OLD (caused CORS error):
const downloadURL = await getDownloadURL(storageRef);
return downloadURL;

// NEW (returns path):
return storagePath; // e.g., 'users/xxx/documents/file.pdf'
```

#### 2. Enhanced `getAuthenticatedFileBlob()` ([firestore.ts](src/services/firestore.ts#L117-L133))
```typescript
export async function getAuthenticatedFileBlob(pathOrUrl: string): Promise<string> {
  const storageRef = ref(storage, pathOrUrl);
  const blob = await getBlob(storageRef); // Authenticated request
  const objectUrl = URL.createObjectURL(blob);
  return objectUrl; // Returns blob URL
}
```

#### 3. Updated DocumentLibrary component ([DocumentLibrary.tsx](src/components/Dashboard/DocumentLibrary.tsx))
- Loads authenticated blob URLs on demand  
- Proper cleanup with `URL.revokeObjectURL()`
- Loading states and error handling
- Works with both legacy URLs and new paths

## Benefits
✅ **No CORS errors** - Files access with proper authentication  
✅ **Works everywhere** - GitHub Codespaces, local dev, production  
✅ **Better security** - Respects all Firebase Storage rules  
✅ **Improved UX** - Loading states and graceful error handling  
✅ **Memory efficient** - Proper cleanup of blob URLs  
✅ **Backward compatible** - Works with old URL-based documents

## How It Works (Upload)
1. User uploads file → File saved to Firebase Storage
2. Function returns storage path (not URL)
3. Path stored in Firestore document
4. **No CORS error** because we skip `getDownloadURL()`

## How It Works (View)
1. User opens document modal
2. Component calls `getAuthenticatedFileBlob(path)`
3. Firebase SDK downloads file with auth tokens
4. Creates temporary `blob://` URL
5. URL used in iframe (no CORS issues!)
6. URL cleaned up when modal closes

## Testing
1. ✅ Upload a PDF document (should succeed without CORS errors)
2. ✅ View the document (PDF loads in iframe)
3. ✅ Download the original file (works correctly)
4. ✅ Switch between "Original File" and "Text Content" views
5. ✅ Close modal (blob URL properly cleaned up)

## Migration Notes
- New uploads automatically use storage paths
- Old documents with full URLs still work (backward compatible)
- No database migration needed
- Both formats handled transparently
