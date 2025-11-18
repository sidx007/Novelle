# Vercel Deployment Guide for Novelle

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas database (already configured)
- GitHub repository with your code

## Quick Deployment Steps

### 1. Prepare Your Project

Make sure your project structure has:
- Frontend in `src/` directory
- Backend in `server/` directory
- `package.json` in root

### 2. Configure Vercel

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Update Server for Production

Modify `server/server.js` to handle Vercel's serverless environment:

```javascript
// Add at the top
const isDev = process.env.NODE_ENV !== 'production';

// Update CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// For Vercel serverless
if (!isDev) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
```

### 4. Add Build Script

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server:dev": "nodemon server/server.js",
    "vercel-build": "npm run build"
  }
}
```

### 5. Deploy to Vercel

#### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 6. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 7. Update Frontend API Calls

Create `src/config.js`:

```javascript
export const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000';
```

Update `src/services/api.js`:

```javascript
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  // ... rest of config
});
```

## Alternative: Split Frontend & Backend

### Deploy Frontend to Vercel

1. Keep only frontend code
2. Simple `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy Backend Separately

Options:
- **Render.com** (Free tier available)
- **Railway.app** (Easy Node.js deployment)
- **Heroku** (More complex, requires credit card)

Update `VITE_API_URL` environment variable in Vercel to point to your backend URL.

## Post-Deployment

1. **Test the deployment:**
   - Visit your Vercel URL
   - Test authentication
   - Test API endpoints
   - Check MongoDB connection

2. **Set up custom domain** (optional):
   - Vercel Dashboard → Domains
   - Add your custom domain
   - Update DNS settings

3. **Monitor logs:**
   - Vercel Dashboard → Deployments → View Function Logs
   - Check for any runtime errors

## Common Issues

### Issue: API routes return 404
**Solution:** Ensure `vercel.json` routes are correct and server exports the app for serverless.

### Issue: MongoDB connection fails
**Solution:** Whitelist Vercel's IP ranges in MongoDB Atlas (0.0.0.0/0 for all IPs).

### Issue: CORS errors
**Solution:** Update CORS origin to match your Vercel domain.

### Issue: Build fails
**Solution:** Check build logs, ensure all dependencies are in `package.json`, not just `devDependencies`.

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel + Vite Guide](https://vercel.com/guides/deploying-vite-with-vercel)
- [MongoDB Atlas IP Whitelist](https://docs.atlas.mongodb.com/security/ip-access-list/)
