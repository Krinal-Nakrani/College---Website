# Rajmata Polytechnic — College Website (MERN)

A working MERN scaffold built to match the layout and structure of the
reference site (ice.edu.in): sticky nav with dropdown programs menu, hero,
quick-facts strip, program listing, "why us," placements, testimonials,
admissions CTA, and a footer — plus a real Express/MongoDB API behind the
courses, notices, and contact-form pages.

The visual design is original (not copied from the reference site) — navy
and amber palette, a drafting-grid texture, and Space Grotesk/IBM Plex Sans
type, meant to evoke an engineering institute rather than a generic template.
Sample content (college name, address, programs) is placeholder — replace it
with your client's actual details before handing it off.

## Structure

```
college-website/
  backend/     Express + Mongoose API
  frontend/    React (Vite) client
```

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a free MongoDB Atlas cluster

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env if your MongoDB URI is different (e.g. an Atlas connection string)
npm run seed     # loads sample courses + notices into the database
npm run dev      # starts the API on http://localhost:5000
```

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev       # starts the site on http://localhost:5173
```

The dev server proxies `/api/*` requests to `http://localhost:5000`
(configured in `vite.config.js`), so both servers need to be running for
courses, notices, and the contact form to work. If nothing appears on the
Courses or Notices pages, that's the API/database not running — the pages
are built to fail gracefully rather than crash.

## What's wired up vs. what's a placeholder

**Working end-to-end:**
- Courses: list + detail pages read live from MongoDB via the API
- Notices: list reads live from MongoDB
- Contact form: posts to the API and saves to the `contactmessages`
  collection

**Placeholder / needs your input before going live:**
- College name, address, phone, email (currently "Rajmata Polytechnic" —
  find-and-replace across `frontend/src`)
- Photography — the "why us" section and hero currently use a grid-texture
  placeholder block where a real campus/lab photo should go
- About/Admissions page copy — written generically, adjust for the actual
  institute
- No authentication yet on the POST/PUT/DELETE routes (`/api/courses`,
  `/api/notices`) — add an admin login before exposing those publicly, since
  right now anyone who finds the API could edit content.
