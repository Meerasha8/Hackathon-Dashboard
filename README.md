# HackTrack 🏆

A private hackathon progress tracker built with React + Tailwind CSS + Supabase.

---

## Tech Stack
- **Frontend:** React 18, Tailwind CSS v3, React Router v6
- **Backend/DB:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel

---

## Setup Guide

### 1. Create React Project & Install Files

```bash
# Create Vite React project
npm create vite@latest hacktrack -- --template react
cd hacktrack

# Delete default files you'll replace
rm -rf src/

# Install dependencies
npm install
```

Then paste all the provided files into the project, maintaining the folder structure:
```
hacktrack/
├── src/
│   ├── components/
│   │   ├── HackathonCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── PhaseForm.jsx
│   │   ├── PhaseRow.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── StatusBadge.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useHackathons.js
│   ├── lib/
│   │   ├── supabase.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CompletedPage.jsx
│   │   ├── CreateHackathonPage.jsx
│   │   └── HackathonDetailPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── schema.sql
```

---

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `schema.sql` and run it
4. Go to **Project Settings** → **API**
5. Copy your **Project URL** and **anon/public key**

---

### 3. Add Users (No Sign-Up Page by Design)

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Invite user"** or **"Add user"** → enter email + password
3. That user can now log in at your app's `/login` page

---

### 4. Environment Variables

Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 5. Run Locally

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — Vercel auto-detects Vite
# Add environment variables in Vercel dashboard:
# VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

Or connect your GitHub repo to Vercel for auto-deployments.

> **Important:** Add the same env vars in **Vercel → Project → Settings → Environment Variables**

---

## Features

### Dashboard
- View all active hackathons (non-completed)
- Filter by status: Upcoming, Registered, Idea Submitted, Active, Submitted
- Search by name or organizer
- Stats row showing counts per status
- Urgency alerts for deadlines within 7 days

### Hackathon Detail
- Full info: name, organizer, description, link, idea, submission requirements, deadline
- **Inline editing** — click Edit to modify all fields in-place
- **Phase management** — add unlimited phases, each with their own deadline, description, and submission requirements
- **Phase inline edit** — click the pencil icon on any phase to edit it in-place
- **Phase completion toggle** — check/uncheck phases with a single click
- Progress bar showing phase completion %

### Completed Page
- Separate archive page for completed hackathons
- Summary stats (total hackathons, phases, completions)

### Status Flow
```
upcoming → registered → idea_submitted → active → submitted → completed
```
Set any status at any time from the edit form.

### Auth
- Login only (no sign-up)
- Add users manually via Supabase dashboard
- All routes are protected — unauthenticated users are redirected to /login
- Row Level Security on all database tables

---

## Status Meanings

| Status | Meaning |
|--------|---------|
| `upcoming` | Discovered, not yet registered |
| `registered` | Team is registered |
| `idea_submitted` | Initial idea submitted |
| `active` | Currently building |
| `submitted` | Final submission done |
| `completed` | Hackathon fully concluded |
