# Vercel Deployment Guide - Novelle with Authentication

## 🚀 Complete Step-by-Step Deployment Instructions

### Prerequisites
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ GitHub repository (recommended) or Vercel CLI
- ✅ MongoDB Atlas database (already configured)

---

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Code to GitHub
\`\`\`bash
cd c:\Users\User\Desktop\SE\se\novelle
git init
git add .
git commit -m "Add authentication system"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
\`\`\`

### Step 2: Import Project to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the framework (Vite)

### Step 3: Configure Build Settings
**Framework Preset**: Vite
**Build Command**: \`npm run build\`
**Output Directory**: \`dist\`
**Install Command**: \`npm install\`

### Step 4: Add Environment Variables
In the Vercel dashboard, add these environment variables:

#### Backend/API Environment Variables
\`\`\`
MONGODB_URI=mongodb+srv://ssharma16be23_db_user:RvtL8DefSS0BldXE@cluster0.w3h3zqt.mongodb.net/Novelle?retryWrites=true&w=majority

JWT_SECRET=<generate-a-strong-secret>

NODE_ENV=production
\`\`\`

#### Frontend Environment Variables
\`\`\`
VITE_API_URL=https://your-app-name.vercel.app/api
\`\`\`

**Generate a strong JWT_SECRET:**
\`\`\`bash
# Run this in your terminal to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Note your deployment URL (e.g., https://novelle-xyz.vercel.app)

### Step 6: Update Environment Variables with Deployment URL
1. After deployment, go to Project Settings → Environment Variables
2. Update these variables:
   - \`VITE_API_URL\`: https://YOUR-DEPLOYMENT-URL.vercel.app/api
   - \`CLIENT_URL\`: https://YOUR-DEPLOYMENT-URL.vercel.app
3. Redeploy (Vercel will automatically redeploy after env changes)

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

### Step 2: Login to Vercel
\`\`\`bash
vercel login
\`\`\`

### Step 3: Deploy
\`\`\`bash
cd c:\Users\User\Desktop\SE\se\novelle

# Deploy to preview (testing)
vercel

# Deploy to production
vercel --prod
\`\`\`

### Step 4: Add Environment Variables via CLI
\`\`\`bash
# Add environment variables
vercel env add MONGODB_URI
# Paste your MongoDB URI when prompted

vercel env add JWT_SECRET
# Paste your JWT secret when prompted

vercel env add NODE_ENV
# Type: production

vercel env add VITE_API_URL
# Type: https://your-app.vercel.app/api
\`\`\`

### Step 5: Redeploy with Environment Variables
\`\`\`bash
vercel --prod
\`\`\`

---

## Vercel Configuration File

Your \`vercel.json\` is already configured:

\`\`\`json
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
      "dest": "/dist/$1"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret",
    "NODE_ENV": "production"
  }
}
\`\`\`

---

## Package.json Build Script

Ensure your \`package.json\` has the build script (already configured):

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/server.js",
    "server:dev": "nodemon server/server.js"
  }
}
\`\`\`

---

## Post-Deployment Checklist

### 1. Test Authentication Flow
- [ ] Visit your deployed URL
- [ ] Register a new account
- [ ] Login with the account
- [ ] Access protected routes (Library, Reader)
- [ ] Logout and verify redirect
- [ ] Login again to ensure persistence

### 2. Check API Endpoints
- [ ] https://your-app.vercel.app/api/health
- [ ] https://your-app.vercel.app/api/auth/register (POST)
- [ ] https://your-app.vercel.app/api/auth/login (POST)

### 3. Verify Database Connection
- [ ] Check MongoDB Atlas → Collections
- [ ] Verify users are being created in the \`users\` collection
- [ ] Check connection logs in Vercel deployment logs

### 4. Monitor Deployment Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. View "Functions" logs to see backend activity
4. View "Build" logs for any build issues

---

## Environment Variables Reference

### Complete List of Environment Variables

#### For Vercel (Backend + Frontend)
\`\`\`env
# Database
MONGODB_URI=mongodb+srv://ssharma16be23_db_user:RvtL8DefSS0BldXE@cluster0.w3h3zqt.mongodb.net/Novelle?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-production-jwt-secret-32-chars-or-more

# Server
NODE_ENV=production
PORT=5000

# CORS
CLIENT_URL=https://your-app-name.vercel.app

# Frontend API URL
VITE_API_URL=https://your-app-name.vercel.app/api
\`\`\`

---

## Troubleshooting Common Deployment Issues

### Issue 1: "Cannot find module" errors
**Solution**: Ensure all dependencies are in \`dependencies\`, not \`devDependencies\`
\`\`\`bash
npm install --save bcryptjs jsonwebtoken cookie-parser mongoose express cors dotenv
\`\`\`

### Issue 2: CORS errors in production
**Solution**: Update \`CLIENT_URL\` in environment variables to match your Vercel URL

### Issue 3: MongoDB connection timeout
**Solution**: 
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add \`0.0.0.0/0\` (allow from anywhere) for Vercel

### Issue 4: 404 on API routes
**Solution**: Check \`vercel.json\` routing configuration and ensure server.js is being built

### Issue 5: JWT verification fails
**Solution**: Ensure \`JWT_SECRET\` is set in Vercel environment variables and is the same across deployments

### Issue 6: Build fails
**Solution**: 
- Check build logs in Vercel dashboard
- Ensure \`vite build\` works locally: \`npm run build\`
- Verify all imports are correct (case-sensitive)

---

## Custom Domain (Optional)

### Add Custom Domain
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update \`CLIENT_URL\` and \`VITE_API_URL\` environment variables

---

## Continuous Deployment

Once connected to GitHub, Vercel will:
- ✅ Auto-deploy on every push to \`main\` branch
- ✅ Create preview deployments for pull requests
- ✅ Run build checks before deployment
- ✅ Provide deployment status in GitHub

---

## Monitoring & Analytics

### View Logs
\`\`\`bash
# Using Vercel CLI
vercel logs YOUR_DEPLOYMENT_URL
\`\`\`

### Analytics
- Vercel provides built-in analytics
- View in Dashboard → Your Project → Analytics

---

## Security Best Practices for Production

1. **JWT Secret**: Use a strong, random 32+ character secret
2. **Environment Variables**: Never commit \`.env\` files to Git
3. **MongoDB**: Use IP whitelist or VPC peering
4. **HTTPS**: Vercel provides free SSL certificates
5. **Rate Limiting**: Consider adding rate limiting middleware
6. **Password Policy**: Enforce strong passwords (add validation)

---

## Scaling Considerations

- **Database**: MongoDB Atlas auto-scales
- **Vercel**: Automatically scales based on traffic
- **Function Limits**: Vercel Serverless Functions have 10s timeout (Hobby plan)
- **File Size**: Max function size is 50MB (including dependencies)

---

## Backup & Recovery

### Backup MongoDB
\`\`\`bash
# Using mongodump
mongodump --uri="YOUR_MONGODB_URI" --out=./backup
\`\`\`

### Rollback Deployment
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

---

## Cost Estimate

### Vercel (Free Tier)
- ✅ 100GB bandwidth/month
- ✅ 6000 build minutes/month
- ✅ 100 serverless function invocations/day (Hobby)
- ✅ Custom domains
- ✅ SSL certificates

### MongoDB Atlas (Free Tier - M0)
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ No credit card required

**Total Cost**: $0 for hobby/learning projects 🎉

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Check deployment logs** in Vercel dashboard
- **Test locally first**: \`npm run dev\` and \`npm run server:dev\`

---

## Quick Deploy Commands

\`\`\`bash
# 1. Build and test locally
npm run build
npm run preview

# 2. Deploy to Vercel
vercel --prod

# 3. Check deployment
vercel ls

# 4. View logs
vercel logs
\`\`\`

---

**Your app is now ready for deployment! 🚀**

Deploy with confidence - all authentication features are production-ready!
