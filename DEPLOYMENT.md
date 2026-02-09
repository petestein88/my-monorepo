# Sacred Deployment Guide

## Overview

This monorepo deploys to multiple platforms:
- **Marketing Site** → Netlify (sacred.systems)
- **Dashboard App** → Netlify (sacred.systems/app) 
- **Backend API** → Your preferred backend host (Render, Railway, Heroku, etc.)

---

## 🚀 Deploy Marketing Site to Netlify

### Prerequisites
- GitHub account connected to Netlify
- Netlify account (free tier works)

### Step 1: Import Site from GitHub

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub repos
5. Search for and select **`petestein88/my-monorepo`**
6. Select the **`unified-v1`** branch

### Step 2: Configure Build Settings

**Site Name**: `sacred-marketing` (or your preferred name)

**Build Settings:**
```
Base directory:    apps/web
Build command:     npm install && npm run build
Publish directory: apps/web/dist
Branch:            unified-v1
```

**Environment Variables:**
```
NODE_VERSION = 18
```

### Step 3: Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at: `https://[site-name].netlify.app`

### Step 4: Add Custom Domain

1. In Netlify site settings, go to **Domain management**
2. Click **"Add custom domain"**
3. Enter: `sacred.systems`
4. Follow DNS setup instructions:
   - Add Netlify nameservers to your domain registrar
   - OR add A/CNAME records as shown
5. Enable HTTPS (automatic with Let's Encrypt)

---

## 📱 Deploy Dashboard App to Netlify

### Option A: Separate Site (Recommended)

Create a second Netlify site for the dashboard:

1. Repeat "Import Site from GitHub" process
2. Use these build settings:

```
Site name:         sacred-dashboard
Base directory:    apps/app
Build command:     npm install && npm run build
Publish directory: apps/app/dist
Branch:            unified-v1
```

3. After deployment, configure custom domain:
   - Add subdomain: `app.sacred.systems`
   - OR configure proxy/rewrite from main site

### Option B: Single Site with Redirects

Configure the marketing site to proxy requests to `/app/*`:

1. Update `netlify.toml` with redirect rules
2. Deploy dashboard separately
3. Use Netlify's proxy feature

---

## 🔧 Backend API Deployment

### Recommended Hosts

**Option 1: Render (Easiest)**
- Free tier available
- Auto-deploy from GitHub
- Built-in PostgreSQL database

**Option 2: Railway**
- Free tier with $5 credit
- Simple setup
- Good PostgreSQL support

**Option 3: Heroku**
- Paid plans only now
- Mature platform

### Deploy to Render (Example)

1. Go to [https://render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repo: `petestein88/my-monorepo`
4. Configure:
   ```
   Name:           sacred-api
   Branch:         unified-v1
   Root Directory: apps/api
   Build Command:  npm install && npm run build
   Start Command:  npm start
   ```
5. Add PostgreSQL database:
   - Create new PostgreSQL instance
   - Copy connection string
6. Set environment variables (see `apps/api/.env.example`)
7. Deploy!

---

## 🔐 Environment Variables

### Marketing Site (apps/web)
```
NODE_VERSION=18
```

### Dashboard App (apps/app)
```
NODE_VERSION=18
VITE_API_URL=https://your-api.render.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend API (apps/api)
```
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=sacred_db

PORT=5000
NODE_ENV=production

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASSWORD=your-app-password
```

---

## 📊 Database Setup

### 1. Create PostgreSQL Database

If using Render:
- Create new PostgreSQL instance in Render dashboard
- Note the connection details

### 2. Run Migrations

```bash
# Connect to your API server (or run locally)
cd apps/api
npm install

# Set environment variables
export DB_HOST=your-host
export DB_USER=your-user
export DB_PASSWORD=your-password
export DB_NAME=sacred_db

# Run migrations
npm run migrate
```

---

## ✅ Post-Deployment Checklist

- [ ] Marketing site loads at `sacred.systems`
- [ ] Dashboard accessible at `sacred.systems/app` or `app.sacred.systems`
- [ ] API health check: `https://your-api.com/health` returns OK
- [ ] Database migrations completed
- [ ] Google OAuth configured and working
- [ ] User registration works
- [ ] Device can send session data to API
- [ ] SSL certificates active (HTTPS)

---

## 🐛 Troubleshooting

### Build Fails on Netlify

**Error**: `Module not found`
- **Fix**: Check `base directory` is set correctly
- **Fix**: Ensure all dependencies in package.json

**Error**: `command not found: vite`
- **Fix**: Build command should be `npm install && npm run build`

### Dashboard Shows Blank Page

**Issue**: React Router not working
- **Fix**: Check `base` prop in vite.config.ts matches deployment path
- **Fix**: Add `/*` redirect to `/index.html` in Netlify

### API Connection Fails

**Issue**: CORS errors in browser console
- **Fix**: Update `corsOptions` in `apps/api/src/server.ts` with your frontend URL
- **Fix**: Set `VITE_API_URL` environment variable in dashboard

### Database Connection Fails

**Issue**: "Connection refused"
- **Fix**: Check database host is accessible
- **Fix**: Verify SSL settings if required
- **Fix**: Ensure IP whitelisting allows your API server

---

## 🔄 Continuous Deployment

Once configured, Netlify automatically deploys when you push to `unified-v1` branch:

```bash
git add .
git commit -m "Update feature"
git push origin unified-v1
```

Netlify will:
1. Detect the push
2. Run build command
3. Deploy new version
4. Update live site (~2-3 minutes)

---

## 📞 Support

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console for errors
3. Check API server logs
4. Review this guide's troubleshooting section
