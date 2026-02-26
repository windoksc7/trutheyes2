# TruthEyes 🔍

**A single-player mystery game where you identify truth vs lies using keyword matching.**

Players solve mystery cases by analyzing statements and identifying keywords that reveal whether claims are true or false. Rack up points, compete on leaderboards, and build your investigative skills.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend/Database:** Supabase (PostgreSQL + Auth)
- **Styling:** CSS (responsive design)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://gyxlcqxgmqrhioaguvdr.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> Get these from your Supabase project dashboard: https://supabase.com/dashboard/project/gyxlcqxgmqrhioaguvdr

### 3. Create Supabase Tables

Go to **SQL Editor** in Supabase and run the commands from [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create tables and RLS policies.

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── auth/
│   └── useAuth.ts                    # Authentication hook (login, signup, logout)
├── components/
│   ├── GameBoard.tsx                 # Main game interface with HP bars & input
│   ├── ResultScreen.tsx              # Win/lose screen with score display
│   ├── CaseSelector.tsx              # Case selection with filtering
│   ├── AuthGuard.tsx                 # Route protection (planned)
│   ├── Leaderboard.tsx               # Leaderboard (planned)
│   ├── CaseForm.tsx                  # Admin case form (planned)
│   └── AdminCaseTable.tsx            # Admin case list (planned)
├── pages/
│   ├── LoginPage.tsx                 # Login/signup forms (planned)
│   ├── LeaderboardPage.tsx           # Top players ranking (planned)
│   └── AdminPage.tsx                 # Case management (planned)
├── hooks/
│   └── useGameLogic.ts               # Game state machine logic
├── types/
│   └── index.ts                      # TypeScript interfaces
├── supabaseClient.ts                 # Supabase client with validation
└── App.tsx                           # Main app, integrates game flow
```

---

## Core Files

**Backend & Auth**

- **[src/types/index.ts](src/types/index.ts)** — TypeScript interfaces (Case, Profile, PlayerProgress, User)
- **[src/auth/useAuth.ts](src/auth/useAuth.ts)** — Auth hook (login, signup, logout, session management)
- **[src/supabaseClient.ts](src/supabaseClient.ts)** — Supabase client with environment variable validation

**Game Logic & Components**

- **[src/hooks/useGameLogic.ts](src/hooks/useGameLogic.ts)** — Game state machine (SELECT_CASE → IN_GAME → RESULT → NEXT)
- **[src/components/GameBoard.tsx](src/components/GameBoard.tsx)** — Case statement, HP bars, keyword input field
- **[src/components/ResultScreen.tsx](src/components/ResultScreen.tsx)** — Win/lose result with score display
- **[src/components/CaseSelector.tsx](src/components/CaseSelector.tsx)** — Case list with difficulty/category filters

**Main App**

- **[src/App.tsx](src/App.tsx)** — Orchestrates auth, game flow, and component rendering

---

## Supabase Schema

### Tables

1. **profiles** — User metadata (username, avatar, bio)
2. **cases** — Mystery statements with answer keywords and difficulty
3. **player_progress** — Game results and scores

### RLS Policies

- **Profiles:** Users can read all, update own only
- **Cases:** Anyone can read, creator can modify
- **Player Progress:** Users can only see/insert their own records

---

## Development Roadmap

See [PLAN.md](./PLAN.md) for the 2-week MVP development plan with daily tasks, file structure, and testing checklist.

**Current Status:** Week 1 Completed ✅ (Auth, Core Game Loop, DB Integration) → Next: Week 2 (Leaderboards & Admin)

### Completed in Week 1:
- **Authentication:** Implemented `useAuth` hook and UI for login/signup with Supabase.
- **Game Logic:** Developed `useGameLogic` state machine with keyword matching and score logging.
- **Database:** Set up Supabase schema (profiles, cases, player_progress) and RLS policies.
- **Verification:** Fixed TypeScript issues, verified build, and validated game logic with tests.

---

## Available Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Deployment

```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, or your hosting provider
```

---

## Contributing

Feel free to fork and submit PRs! Follow the structure in PLAN.md.

---

## License

MIT
]);

```

```
