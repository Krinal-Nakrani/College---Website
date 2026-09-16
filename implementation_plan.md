# Admin Panel — Firebase Auth + Separate Deployment

## Goal

Add a **staff-only Admin Dashboard** to manage Notices, Courses, and Contact messages — protected by **Firebase Authentication** (Email/Password).

The admin panel is a **completely separate Vite app** (`/admin`), deployed independently on Vercel. It talks to the **same Express backend** (Render), but write-endpoints (`POST/PUT/DELETE`) are now guarded by a Firebase ID-token middleware that verifies the caller is a whitelisted admin.

---

## Architecture Overview

```
college-website/
  backend/          ← existing API (add firebase-admin middleware)
  frontend/         ← existing public site (unchanged)
  admin/            ← NEW: standalone Vite + React admin SPA
```

| Layer | Details |
|---|---|
| **Auth** | Firebase Auth (Email/Password) — free Spark plan |
| **Backend guard** | `firebase-admin` SDK verifies ID tokens on every mutating route |
| **Admin SPA** | Separate Vite app at `college-website-admin.vercel.app` |
| **Public site** | Unchanged — GET routes remain open |

---

## User Review Required

> [!IMPORTANT]
> The admin panel will be deployed as a **separate Vercel project** (`/admin` folder). This means a different URL (e.g., `nilkanth-admin.vercel.app`). Admin users bookmark this URL.

> [!WARNING]
> The `POST/PUT/DELETE` routes on the backend will require a valid Firebase ID Token header from now on. Any existing scripts that call these routes without a token will get `401 Unauthorized`. The public `GET` routes stay open.

> [!IMPORTANT]
> You need to generate a **Firebase Service Account JSON** from the Firebase Console. This JSON is added as a Render environment variable (`FIREBASE_SERVICE_ACCOUNT`). Do **NOT** commit it to Git.

---

## Open Questions

> [!NOTE]
> **Admin users**: Should only you (the principal) log in, or do you need to add multiple staff accounts (HOD, office staff)? This determines whether we use Firebase's built-in email/password or add role-based claims later. For now, the plan assumes a single admin account — you create it manually in the Firebase Console.

---

## Firebase Setup — Step-by-Step

### Step 1 — Enable Authentication in Firebase Console

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **college-website-c9a4e**
2. Left sidebar → **Build → Authentication**
3. Click **Get Started**
4. Under "Sign-in method" tab → **Email/Password** → Enable → Save
5. Under "Users" tab → **Add user** → enter your admin email + strong password → Save

### Step 2 — Register a Web App (for the admin SPA)

1. Project Overview (gear icon) → **Project settings**
2. Scroll to "Your apps" → Click **`</>`** (Web)
3. App nickname: `Admin Dashboard` (do NOT enable Firebase Hosting — use Vercel)
4. Click **Register app**
5. Copy the `firebaseConfig` object — you'll need it for `admin/src/firebase.js`

### Step 3 — Generate Service Account (for Express backend)

1. Project settings → **Service accounts** tab
2. Click **Generate new private key** → Download JSON
3. Open the JSON — copy its **entire contents**
4. On Render (backend) → Environment → add variable:
   - Key: `FIREBASE_SERVICE_ACCOUNT`
   - Value: *paste the entire JSON string* (Render accepts multi-line)
5. Also add:
   - `ADMIN_ORIGIN` = `https://nilkanth-admin.vercel.app` (or `*` during dev)

---

## Proposed Changes

### Backend — Add Firebase Admin Middleware

#### [MODIFY] [`server.js`](file:///d:/Downloads/krinal%20-%20college-website/backend/server.js)
- Add `firebase-admin` initialisation from `FIREBASE_SERVICE_ACCOUNT` env var
- Export `verifyToken` middleware
- Update CORS to allow both `CLIENT_ORIGIN` and `ADMIN_ORIGIN`

#### [NEW] `backend/middleware/verifyToken.js`
- Verifies `Authorization: Bearer <idToken>` header using `firebase-admin`
- Returns `401` if missing/invalid, calls `next()` if valid

#### [MODIFY] [`backend/routes/courses.js`](file:///d:/Downloads/krinal%20-%20college-website/backend/routes/courses.js)
- Protect `POST`, `PUT`, `DELETE` with `verifyToken` middleware
- `GET` routes remain open

#### [MODIFY] [`backend/routes/notices.js`](file:///d:/Downloads/krinal%20-%20college-website/backend/routes/notices.js)
- Protect `POST`, `DELETE` with `verifyToken` middleware

#### [NEW] `backend/routes/contacts.js` (GET for admin)
- `GET /api/contacts` protected by `verifyToken` — lists all contact form submissions
- (The existing `contact.js` only has `POST`)

---

### Admin SPA — New Vite + React App

#### [NEW] `admin/` — entire new Vite project
```
admin/
  index.html
  vite.config.js          ← port 5174, proxy /api → localhost:5000
  vercel.json             ← SPA rewrite
  package.json
  src/
    main.jsx
    App.jsx               ← Router: /login, /dashboard/*
    firebase.js           ← Firebase client SDK init
    api.js                ← axios wrapper that injects Bearer token
    context/
      AuthContext.jsx     ← Firebase auth state provider
    components/
      PrivateRoute.jsx    ← Redirects to /login if not authenticated
      Sidebar.jsx         ← Left navigation: Notices / Courses / Messages
      TopBar.jsx          ← User info + logout button
      StatCard.jsx        ← Summary count cards
    pages/
      Login.jsx           ← Email/Password sign-in form
      Dashboard.jsx       ← Overview stats
      NoticesManager.jsx  ← List, add, delete notices
      CoursesManager.jsx  ← List, add, edit, delete courses
      MessagesView.jsx    ← Read-only contact form submissions
    styles/
      admin.css           ← Full engineering-drafting dark theme
      login.css
      dashboard.css
      managers.css
```

#### Visual Theme
Same **navy/amber engineering-drafting** aesthetic as the public site — dark sidebar, amber accents, Space Grotesk font, subtle grid background, glassmorphism cards.

---

## Deployment Plan

### Admin SPA → Vercel

1. `git add admin/` → push to GitHub
2. Vercel → **Add New Project** → import same repo
3. **Root Directory**: `admin`
4. **Framework Preset**: Vite
5. **Env vars**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_API_URL` = `https://<your-render-url>.onrender.com`
6. Deploy → note the URL (e.g., `nilkanth-admin.vercel.app`)

### Backend → Update Render

Add these new env vars on Render:
| Key | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON string of service account |
| `ADMIN_ORIGIN` | `https://nilkanth-admin.vercel.app` |

---

## File Change Summary

| File | Action | Why |
|---|---|---|
| `backend/server.js` | Modify | firebase-admin init, CORS update |
| `backend/middleware/verifyToken.js` | **New** | Token verification middleware |
| `backend/routes/courses.js` | Modify | Protect write routes |
| `backend/routes/notices.js` | Modify | Protect write routes |
| `backend/routes/contact.js` | Modify | Add admin GET route |
| `admin/` (entire folder) | **New** | Standalone admin SPA |

---

## Verification Plan

### Local Dev
1. `cd backend && npm run dev` (port 5000)
2. `cd admin && npm run dev` (port 5174)
3. Open `http://localhost:5174` → redirected to `/login`
4. Sign in with admin email → dashboard loads
5. Create a notice → verify it appears on `http://localhost:5173/notices`
6. Try calling `POST /api/notices` without a token → get `401`

### Automated Tests
```bash
# Backend health check
curl http://localhost:5000/api/health

# Unprotected GET — should work
curl http://localhost:5000/api/notices

# Protected POST without token — should return 401
curl -X POST http://localhost:5000/api/notices -H "Content-Type: application/json" -d '{"title":"Test"}'
```

### Manual Verification
- Admin login flow works end-to-end
- Logout clears session and redirects to `/login`
- All CRUD operations reflect on the public site immediately
