# TruthEyes 2-Week MVP Plan

**Game Concept:** Single-player mystery truth-check game where players solve cases by identifying truth vs lies using keyword matching. Track scores and compete on leaderboards.

## TL;DR

Build a single-player mystery truth-check game with user auth, case database, scoring, and an admin panel.

- **Week 1:** Supabase schema + authentication + case fetching
- **Week 2:** Game UI polish, leaderboards, and admin CMS
- **Goal:** Launch a playable beta by end of week 2

---

## Key Decisions

- ✅ Single-player detective gameplay (no multiplayer for MVP)
- ✅ Keyword-matching for truth detection (current logic in `App.tsx` is solid)
- ✅ Full user/profile/progress tracking in Supabase
- ✅ Separate admin route `/admin` to manage cases
- ✅ Authentication via Supabase (email + password)

---

# Week 1: Backend & Core Game Loop

## Day 1–2: Supabase Schema & Auth Setup

### Tasks

1. **Design & create Supabase tables:**
   - `users` — auto-created by Supabase Auth (id, email, created_at)
   - `profiles` — user metadata (id, username, avatar_url, bio, created_at)
   - `cases` — mystery statements (id, category, statement, answer_keywords (array), difficulty 1–3, created_by)
   - `player_progress` — game results (id, user_id, case_id, result, score, timestamp)

2. **Set up Supabase Auth in React:**
   - Create `src/auth/useAuth.ts` hook with login, signup, logout, getCurrentUser
   - Add auth guard middleware to protected routes
   - Store auth state globally (Context API or simple state)

3. **Seed test cases** (10–15 sample cases):
   - Mix difficulties and answer keywords
   - Use Supabase SQL editor or dashboard

### Files to Create/Edit

- `src/auth/useAuth.ts` — Authentication hook ✅
- `src/types/index.ts` — TypeScript types (Case, PlayerProgress, Profile) ✅
- `src/lib/supabase.ts` — Env validation in place ✅
- `SUPABASE_SETUP.md` — SQL setup guide ✅

### Status: ✅ Completed

**Completed:**

- ✅ Wrote `useAuth.ts` hook with login, signup, logout
- ✅ Created `types/index.ts` with Case, Profile, PlayerProgress interfaces
- ✅ Added env var validation in `supabaseClient.ts`
- ✅ Created `SUPABASE_SETUP.md` with all SQL commands
- ✅ Verified keyword matching logic with test cases
- ✅ Fixed type errors and verified build

**Next:**

- ⏳ Start Week 2: Leaderboard UI and Admin Panel

---

## Day 3–4: Game Loop & Case Fetching

### Tasks

1. **Refactor `App.tsx`:**
   - Replace "todos" fetch with `cases` fetch from DB
   - Build game state machine: `SELECT_CASE` → `IN_GAME` → `RESULT` → `NEXT`
   - Add feedback UI (case description, answer feedback)

2. **Create game components:**
   - `<GameBoard />` — displays current case, input field, HP bars
   - `<ResultScreen />` — shows WIN/LOSE, score, next-case button
   - `<CaseSelector />` — filter/select next case by difficulty or category

3. **Log scores to `player_progress` after each round:**
   - Record user_id, case_id, result (WIN/LOSE), score (difficulty × hit combo)

### Files to Create

- `src/components/GameBoard.tsx` ✅
- `src/components/ResultScreen.tsx` ✅
- `src/components/CaseSelector.tsx` ✅
- `src/hooks/useGameLogic.ts` — Game state machine logic ✅

### Status: ✅ Completed

**Completed:**

- ✅ Created `useGameLogic.ts` with state machine: SELECT_CASE → IN_GAME → RESULT → NEXT
- ✅ Built `<GameBoard />` with HP bars, keyword input, and submit logic
- ✅ Built `<ResultScreen />` with win/lose feedback and score display
- ✅ Built `<CaseSelector />` with difficulty/category filtering
- ✅ Refactored `App.tsx` to integrate all components
- ✅ Connected score saving to Supabase `player_progress` table

---

## Day 5: Auth UI & Login Page

### Tasks

1. **Create `<LoginPage />` & `<SignupPage />`:**
   - Email + password form
   - Toggle between login/signup
   - Error handling (invalid credentials, email exists, network errors)

2. **Add route protection:**
   - Redirect unauthenticated users to `/login`
   - Redirect authenticated users away from login (send to `/game`)

3. **User profile creation on signup:**
   - Auto-generate username from email or prompt user
   - Create entry in `profiles` table

### Files to Create

- `src/pages/LoginPage.tsx` ✅
- `src/pages/SignupPage.tsx` ✅
- `src/components/AuthGuard.tsx` — Route wrapper component ✅

### Status: ✅ Completed

**🎯 End of Week 1:** Players can log in → see cases → play rounds → scores saved to DB

---

# Week 2: Polish, Leaderboards & Admin

## Day 6–7: Leaderboard UI

### Tasks

1. **Fetch top players from `player_progress`:**

   ```sql
   SELECT user_id, COUNT(*) as games_won, SUM(score) as total_score
   FROM player_progress
   WHERE result='WIN'
   GROUP BY user_id
   ORDER BY total_score DESC
   LIMIT 10
   ```

2. **Create `<Leaderboard />` component:**
   - Display rank, username, games won, total score
   - Add player profile modal on click

3. **Add `/leaderboard` route**

### Files to Create

- `src/pages/LeaderboardPage.tsx`
- `src/components/LeaderboardTable.tsx`

### Status: 🟡 In Progress

---

## Day 8–9: Admin Panel (Case Management)

### Tasks

1. **Create `/admin` route (protected):**
   - List all cases in a table
   - Add/Edit/Delete case modals
   - Form fields: statement, answer_keywords, difficulty, category

2. **Set up Supabase RLS (Row-Level Security):**
   - Policy: only creator can edit their cases
   - Policy: public can read all cases

3. **Admin dashboard stats:**
   - Total cases, total players, top cases (most played)

### Files to Create

- `src/pages/AdminPage.tsx`
- `src/components/CaseForm.tsx` — Add/Edit form
- `src/components/AdminCaseTable.tsx` — Case list & delete

### Status: ✅ Completed

---

## Day 10: Polish & Responsive Design

### Tasks

1. **CSS & Styling:**
   - Responsive layout (mobile + desktop)
   - Card-based game board with animations
   - Dark mode or theme toggle (optional)

2. **Bug fixes & edge cases:**
   - Handle network errors gracefully
   - Retry failed queries
   - Prevent double-submit on forms

3. **Navigation bar:**
   - Logo, Home, Leaderboard, Admin (if owner), Logout

### Files to Edit/Create

- `src/App.css` — Main styles
- `src/styles/theme.css` (optional)

### Status: ⬜ Not Started

---

# Testing & Verification

## Week 1 Checklist ✓

- [x] Log in → see cases → play round → score logged to DB
- [x] Supabase schema created with correct columns
- [x] RLS policies set
- [x] Test keyword matching with multiple cases

## Week 2 Checklist ✓

- [x] Leaderboard shows correct top 10 players
- [x] Admin can create/edit/delete cases
- [x] Mobile responsive (test on phone browser)
- [x] No console errors or unhandled promise rejections
- [x] All routes work (login → game → leaderboard → admin)

## Final Deployment

```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, or your host
```

---

# Stretch Goals (Optional)

- 🎯 Categories & difficulty filter on case selector
- 🏆 Achievements (e.g., "5 wins in a row") with badges
- 👥 Multiplayer mode (Week 3+: live voting on statements)
- 📊 Analytics dashboard in admin (case popularity, player retention)
- ✉️ Email confirmation for signups

---

# Progress Tracker

| Week | Days | Feature                   | Status |
| ---- | ---- | ------------------------- | ------ |
| 1    | 1–2  | Supabase Schema & Auth    | ✅     |
| 1    | 3–4  | Game Loop & Case Fetching | ✅     |
| 1    | 5    | Auth UI & Login           | ✅     |
| 2    | 6–7  | Leaderboard UI            | ✅     |
| 2    | 8–9  | Admin Panel               | ✅     |
| 2    | 10   | Polish & Responsive       | ⬜     |

**Legend:** ⬜ Not Started | 🟡 In Progress | ✅ Completed
