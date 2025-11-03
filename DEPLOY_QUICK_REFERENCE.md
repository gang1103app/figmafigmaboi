# Render Deployment - Quick Reference Card

**📖 Full Guide:** [DEPLOY_TO_RENDER.md](./DEPLOY_TO_RENDER.md)

---

## Prerequisites
- ✅ GitHub account with access to `gang1103app/figmafigmaboi`
- ✅ Render account (free at [render.com](https://render.com))

---

## Option 1: Blueprint Deploy (Easiest - 10 minutes)

### Steps:
1. **Render Dashboard** → New + → **Blueprint**
2. **Connect GitHub** → Select `gang1103app/figmafigmaboi`
3. **Branch**: `1.4` (CRITICAL)
4. **Apply** → Wait ~10 minutes
5. **Get URLs** from dashboard:
   - Backend: `https://energy-teen-api-XXXX.onrender.com`
   - Frontend: `https://energy-teen-app-XXXX.onrender.com`

### Configure Environment Variables:

**Backend (`energy-teen-api`):**
- Go to Environment tab
- Set: `FRONTEND_URL=https://your-frontend-url.onrender.com`
- Save (auto-redeploys)

**Frontend (`energy-teen-app`):**
- Go to Environment tab
- Set: `VITE_API_URL=https://your-backend-url.onrender.com/api`
- Save → **Manual Deploy**

### Initialize Database:
1. **Backend Shell** tab
2. Run: `npm run db:migrate`
3. Verify tables created

### Done! ✅
Test at your frontend URL.

---

## Option 2: Manual Deploy (Step-by-step)

### Part 1: Database (3 min)
```
New + → PostgreSQL
Name: energy-teen-db
Database: energyteen
Region: oregon
Plan: Free
→ Copy Internal Database URL
```

### Part 2: Backend (5 min)
```
New + → Web Service
Repo: gang1103app/figmafigmaboi
Branch: 1.4
Root Directory: backend
Build: npm install
Start: npm start
```

**Environment Variables:**
```env
DATABASE_URL=[from Part 1]
JWT_SECRET=[random 32+ chars]
NODE_ENV=production
PORT=10000
FRONTEND_URL=[set after Part 3]
```

### Part 3: Frontend (3 min)
```
New + → Static Site
Repo: gang1103app/figmafigmaboi
Branch: 1.4
Build: npm install && npm run build
Publish: dist
```

**Environment Variables:**
```env
VITE_API_URL=[backend-url]/api
```

### Part 4: Update Backend CORS
```
Backend → Environment
Update FRONTEND_URL=[frontend-url]
Save (auto-redeploys)
```

### Part 5: Database Migration
```
Backend → Shell
Run: npm run db:migrate
```

### Done! ✅

---

## Configuration Reference

### Backend (`energy-teen-api`)
| Setting | Value |
|---------|-------|
| Type | Web Service |
| Branch | `1.4` |
| Root Dir | `backend` |
| Build | `npm install` |
| Start | `npm start` |
| Region | oregon (match DB) |

**Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@host/db  # Internal DB URL
JWT_SECRET=random_string_min_32_chars        # Generate secure
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.onrender.com  # No trailing slash
```

### Frontend (`energy-teen-app`)
| Setting | Value |
|---------|-------|
| Type | Static Site |
| Branch | `1.4` |
| Build | `npm install && npm run build` |
| Publish | `dist` |

**Environment Variables:**
```env
VITE_API_URL=https://your-backend.onrender.com/api  # Must include /api
```

### Database (`energy-teen-db`)
| Setting | Value |
|---------|-------|
| Type | PostgreSQL |
| Name | `energy-teen-db` |
| Database | `energyteen` |
| Plan | Free (1GB) |

---

## Verification Checklist

- [ ] All 3 services show "Live"/"Available"
- [ ] Health check works: `https://backend-url/api/health`
- [ ] Frontend loads at: `https://frontend-url`
- [ ] No CORS errors in browser console (F12)
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Data persists after logout/login

---

## Essential Commands

```bash
# Database migration (run in backend Shell)
npm run db:migrate

# Check health
curl https://your-backend.onrender.com/api/health

# Generate JWT secret
openssl rand -base64 32
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Build fails | Verify branch is `1.4`, root dir is `backend` |
| CORS error | Set `FRONTEND_URL` in backend (exact URL, no trailing slash) |
| API 404 | Set `VITE_API_URL` in frontend (must end with `/api`) |
| DB error | Use Internal Database URL, verify database is "Available" |
| Slow first request | Normal on free tier (30-60s spin-up time) |
| Tables missing | Run `npm run db:migrate` in backend Shell |

---

## Cost

**Free Tier:** $0/month
- PostgreSQL: 1GB storage
- Backend: 750 hrs/month (spins down after 15 min)
- Frontend: 100GB bandwidth/month

**Paid (Optional):** $7/month per service for always-on

---

## Support

- 📖 Full Guide: [DEPLOY_TO_RENDER.md](./DEPLOY_TO_RENDER.md)
- 🔍 Verification: [DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)
- 🌐 Render Docs: [render.com/docs](https://render.com/docs)
- 💬 Community: [community.render.com](https://community.render.com)

---

**Need detailed instructions?** See [DEPLOY_TO_RENDER.md](./DEPLOY_TO_RENDER.md)
