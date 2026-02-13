# Sacred Platform Migration Status

**Branch**: `unified-v1`  
**Created**: February 9, 2026  
**Status**: Phase 1 Complete - Core Structure Built

---

## ✅ What's Been Built

### 1. Monorepo Structure
- [x] Root workspace configuration
- [x] npm workspaces setup
- [x] Shared tooling (Prettier, ESLint configs)
- [x] Netlify deployment config

### 2. Marketing Website (`apps/web`)
- [x] React + TypeScript + Vite + Tailwind
- [x] Landing page with sacred.systems content
- [x] About page
- [x] Dark mode design system (black/white/monochrome)
- [x] Responsive header with navigation
- [x] Footer component
- [x] Link to dashboard at `/app`
- [x] Production-ready build config

### 3. Dashboard App (`apps/app`)
- [x] Package.json with all dependencies
- [x] TypeScript + Vite + Tailwind config
- [x] Dark mode base styles
- [x] Entry point structure (main.tsx, providers)
- [x] Router setup with `/app` base path
- [ ] **TODO**: Copy all page components from `iot-frontend`
- [ ] **TODO**: Rebrand "manu-mission" → "sacred"
- [ ] **TODO**: Apply dark mode to all pages
- [ ] **TODO**: Update API URLs in config

### 4. Backend API (`apps/api`)
- [x] Package.json with dependencies
- [x] TypeScript + Express setup
- [x] Server entry point
- [x] Environment configuration
- [x] Cron job for streak updates
- [x] README with deployment guide
- [ ] **TODO**: Copy all source files from `iot` backend
- [ ] **TODO**: Copy database migrations
- [ ] **TODO**: Test all endpoints

### 5. Documentation
- [x] Main README with project overview
- [x] Comprehensive DEPLOYMENT.md guide
- [x] This migration status document
- [x] Per-app READMEs with setup instructions

---

## 🚧 What Needs to Be Completed

### Priority 1: Complete Dashboard App

The dashboard structure exists, but the actual page components need to be copied:

**Files to copy from `iot-frontend/src` to `apps/app/src`:**

```bash
# Required directories:
- components/     (all UI components)
- pages/          (Home, Data, Friends, Challenges, Settings, Login, Register, FAQs)
- hooks/          (custom React hooks)
- providers/      (context providers for auth, etc.)
- types/          (TypeScript types)
- schemas/        (validation schemas)
- utils/          (helper functions)
- config/         (API config, constants)
- enums/          (TypeScript enums)
- constants/      (app constants)
- modals/         (modal components)
- layout/         (layout components)
- images/         (image assets)
- css/            (additional styles)
```

**After copying, update:**
1. Replace all "manu-mission" with "sacred" (case-sensitive)
2. Replace all "Manu Mission" with "Sacred"
3. Update API base URL in config to point to your deployed backend
4. Apply dark mode classes to all components:
   - `bg-sacred-black` instead of light backgrounds
   - `text-sacred-white` instead of dark text
   - `bg-sacred-gray` for cards/sections
   - `border-sacred-white/10` for borders

### Priority 2: Complete Backend API

**Files to copy from `iot/src` to `apps/api/src`:**

```bash
# Required directories:
- controllers/     (all controller logic)
- routers/         (all route definitions)
- services/        (business logic)
- middlewares/     (auth, validation, etc.)
- migrations/      (all 15 database migrations)
- config/          (database config, migrate/rollback scripts)
- types/           (TypeScript types)
- schemas/         (Joi validation schemas)
- utils/           (helper functions)
- helpers/         (additional helpers)
- enums/           (TypeScript enums)
- constants/       (app constants)
- templates/       (email templates)
```

**After copying:**
1. Update brand references if any ("manu-mission" → "sacred")
2. Test database connection
3. Run migrations
4. Test all API endpoints

### Priority 3: Deploy & Test

1. **Deploy Marketing Site**
   - Follow DEPLOYMENT.md Step 1
   - Test at sacred.systems

2. **Deploy Backend API**
   - Set up PostgreSQL database
   - Deploy to Render/Railway
   - Run migrations
   - Test `/health` endpoint

3. **Deploy Dashboard**
   - Update `VITE_API_URL` environment variable
   - Deploy to Netlify
   - Test login/register flow

4. **End-to-End Testing**
   - User can register
   - User can login
   - Dashboard loads correctly
   - API calls work
   - Device can send session data

---

## 📝 Quick Copy Commands

To quickly copy files from your private repos to this monorepo:

### Method 1: Manual Git Clone + Copy

```bash
# Clone both private repos locally
git clone git@github.com:petestein88/iot-frontend.git /tmp/iot-frontend
git clone git@github.com:petestein88/iot.git /tmp/iot

# Clone this monorepo
git clone git@github.com:petestein88/my-monorepo.git
cd my-monorepo
git checkout unified-v1

# Copy frontend files
cp -r /tmp/iot-frontend/src/* apps/app/src/

# Copy backend files
cp -r /tmp/iot/src/* apps/api/src/

# Commit changes
git add .
git commit -m "feat: copy complete platform source code"
git push origin unified-v1
```

### Method 2: GitHub Web Interface

1. Download zips of both repos from GitHub
2. Extract locally
3. Copy files to correct locations in monorepo
4. Commit and push

---

## 🎯 Next Steps

### Immediate (Do Now)

1. **Copy all source files** from iot-frontend and iot repos
2. **Find and replace** "manu-mission" → "sacred" everywhere
3. **Update API URLs** in dashboard config
4. **Test builds locally**:
   ```bash
   npm install
   npm run dev:web    # Should run on port 3000
   npm run dev:app    # Should run on port 3001
   npm run dev:api    # Should run on port 5000
   ```

### Short-term (This Week)

1. **Deploy marketing site** to Netlify
2. **Set up PostgreSQL database** on Render/Railway
3. **Deploy backend API** and run migrations
4. **Deploy dashboard** with correct API URL
5. **Test complete user flow**

### Medium-term (Next 2 Weeks)

1. **Apply dark mode design** consistently across all dashboard pages
2. **Add video background** to marketing site landing page
3. **Test device integration** (ESP32 → API → Dashboard)
4. **Add analytics** (Plausible/Fathom)
5. **Performance optimization**

---

## 📚 Resources

- **Monorepo**: [https://github.com/petestein88/my-monorepo/tree/unified-v1](https://github.com/petestein88/my-monorepo/tree/unified-v1)
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Main README**: See root `README.md`
- **Netlify**: [https://app.netlify.com](https://app.netlify.com)
- **Render**: [https://render.com](https://render.com)

---

## ❓ Questions?

If anything is unclear:
1. Check the DEPLOYMENT.md guide
2. Review app-specific READMEs in each `/apps` folder
3. Check Netlify/Render docs for platform-specific issues

---

**Ready to complete the migration?** Start with "Next Steps - Immediate" above! 🚀
