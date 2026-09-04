# Firebase Storage Setup Guide

This guide will help you upload your GLB assets to Firebase Storage so they load correctly on Vercel.

## Why Firebase?

Vercel's free tier has file size limitations. Firebase Storage gives you 1GB free storage + 1GB monthly downloads - perfect for game assets.

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Enter project name: `endless-rooms` (or your preferred name)
4. Accept terms and click **"Continue"**
5. Disable Google Analytics (optional, click next)
6. Click **"Create Project"**
7. Wait for the project to initialize (~30 seconds)

### 2. Enable Cloud Storage

1. In Firebase Console, go to **"Build"** → **"Storage"** (left sidebar)
2. Click **"Get Started"**
3. In the "Secure your data" dialog:
   - Select **"Start in test mode"** (allows anyone to read files)
   - Read the warning and click **"Next"**
4. Choose storage location: **US (multi-region)** or closest to you
5. Click **"Done"**

### 3. Upload Your GLB Files

#### Option A: Upload via Firebase Console (Easiest)

1. In Storage, click **"Upload folder"**
2. Create a new folder on your computer: `game-assets`
3. Copy these files into the `game-assets` folder:
   ```
   hantu_kyunti.glb
   torture_chair.glb
   ornate_ouija_board_and_planchette.glb
   old_bathroom_cabinet_with_weathered_wood_texture.glb
   hello_neighbor__mantrap.glb
   spider.glb
   old_bible.glb
   hightpoly_barell_game_ready.glb
   ```
4. Select the `game-assets` folder and upload
5. Wait for upload to complete

#### Option B: Upload Individual Files

1. Click **"Upload file"** button
2. Select each `.glb` file from your `Endless-Room` folder
3. Upload one by one

### 4. Get Your Firebase Config

1. Click the **Settings gear icon** (top left) → **"Project Settings"**
2. Go to **"General"** tab
3. Scroll down to find your **Project ID** (looks like: `endless-rooms-abc123`)
4. Also find the **Storage bucket** (looks like: `endless-rooms-abc123.appspot.com`)

### 5. Update Your Code

1. Open `index.html` in your editor
2. Find this section (around line 703):
   ```javascript
   const FIREBASE_CONFIG = {
     projectId: 'endless-rooms-12345', // Replace with YOUR Firebase Project ID
     storageBucket: 'endless-rooms-12345.appspot.com', // Replace with YOUR bucket
     enabled: false // Set to true once you upload files to Firebase
   };
   ```

3. Replace with YOUR values:
   ```javascript
   const FIREBASE_CONFIG = {
     projectId: 'your-actual-project-id',
     storageBucket: 'your-actual-bucket.appspot.com',
     enabled: true  // Enable Firebase storage
   };
   ```

### 6. Verify Files Are Public

1. Go back to Firebase Storage
2. Click on any `.glb` file
3. Look for the download URL in the right panel (or click the link icon)
4. Copy the URL and test it in your browser - you should see a download prompt

### 7. Deploy & Test

1. Commit your changes:
   ```bash
   git add index.html
   git commit -m "Enable Firebase Storage for assets"
   git push
   ```

2. Vercel will auto-deploy
3. Wait for deployment to complete
4. Test your game at the Vercel URL
5. Check browser console (F12) for any errors

## Troubleshooting

### Files still not loading?

1. **Check the console (F12 → Console tab)** for error messages
2. **Verify your Firebase config** is correct (Project ID and Storage Bucket)
3. **Make sure `enabled: true`** in the config
4. **Check file permissions** - Storage should be in "test mode"

### "Access denied" errors?

1. Go to Firebase Storage → **Rules** tab
2. Replace with:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
       }
     }
   }
   ```
3. Click **"Publish"**

### Want to Restrict Access Later?

When you're ready to secure your project, change the rule to:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Free Tier Limits

- **Storage**: 1 GB free
- **Downloads**: 1 GB per month free
- **Uploads**: Unlimited

Your game assets are ~200MB, well within limits!

## Testing Local vs Firebase

To test Firebase URLs locally:
1. Update `index.html` config to use your Firebase URL
2. Run: `python -m http.server 8000`
3. Open: `http://localhost:8000`
4. Check if models load

To use local files again:
- Set `enabled: false` in config

---

Need help? Check Firebase documentation: https://firebase.google.com/docs/storage
