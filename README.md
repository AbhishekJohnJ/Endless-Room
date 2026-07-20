# Endless Rooms

Endless Room is a psychological horror game where users detect changes in a room. Navigate through endless rooms, memorize the reference room, and identify anomalies to survive.

## Features
- 3D horror environment built with Three.js
- Multiple difficulty levels (Easy, Medium, Hard)
- 3D models and atmospheric audio
- Ghost encounters and jump scares
- Progressive difficulty system

## Local Development

Run a local server:
```bash
python -m http.server 8000
```

Then open: `http://localhost:8000/index.html`

## Deployment

### Deploy to Vercel

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will automatically detect it as a static site
5. Click "Deploy"

All GLB models, images, and audio files will be included automatically!

## Assets Included
- 3D Models (.glb): Ghost models, furniture, props
- Audio: Background music and sound effects
- Images: Textures and backgrounds