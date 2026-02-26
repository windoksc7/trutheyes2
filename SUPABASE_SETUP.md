# Supabase Setup Guide

This guide contains all SQL commands needed to set up TruthEyes database tables and security policies.

## Step 1: Create Tables

Go to **SQL Editor** in your Supabase dashboard and run this script:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100),
  statement TEXT NOT NULL,
  answer_keywords TEXT[] NOT NULL,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 3),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create player_progress table
CREATE TABLE player_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  result VARCHAR(10) CHECK (result IN ('WIN', 'LOSE')),
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 2: Enable Row Level Security (RLS)

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
```

## Step 3: Create RLS Policies

### Profiles Policies

```sql
-- Anyone can read profiles
CREATE POLICY "Users can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Cases Policies

```sql
-- Anyone can read cases
CREATE POLICY "Anyone can read cases"
  ON cases FOR SELECT
  USING (true);

-- Only creator can update their cases
CREATE POLICY "Creator can update own cases"
  ON cases FOR UPDATE
  USING (auth.uid() = created_by);

-- Only creator can delete their cases
CREATE POLICY "Creator can delete own cases"
  ON cases FOR DELETE
  USING (auth.uid() = created_by);

-- Anyone authenticated can insert cases
CREATE POLICY "Authenticated users can insert cases"
  ON cases FOR INSERT
  WITH CHECK (auth.uid() = created_by);
```

### Player Progress Policies

```sql
-- Users can only read their own progress
CREATE POLICY "Users can read own progress"
  ON player_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own progress
CREATE POLICY "Users can insert own progress"
  ON player_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Step 4: Seed Sample Cases

Replace `your-user-id` with your actual Supabase user ID, or use the admin API to insert with `created_by` as the owner.

```sql
INSERT INTO cases (category, statement, answer_keywords, difficulty, created_by)
VALUES
  ('Logic', 'The Earth is flat.', ARRAY['false', 'sphere', 'round'], 1, 'your-user-id'),
  ('History', 'Napoleon was born on Cuba.', ARRAY['false', 'corsica'], 1, 'your-user-id'),
  ('Science', 'Water boils at 100°C at sea level.', ARRAY['true', 'yes'], 1, 'your-user-id'),
  ('Math', 'Pi equals exactly 3.14.', ARRAY['false', 'irrational', 'approximation'], 2, 'your-user-id'),
  ('Biology', 'Humans have 206 bones.', ARRAY['true', 'skeleton'], 2, 'your-user-id'),
  ('Geography', 'Australia is the largest country by area.', ARRAY['false', 'russia'], 2, 'your-user-id'),
  ('Technology', 'The first computer bug was a real insect.', ARRAY['true', 'moth'], 3, 'your-user-id'),
  ('Space', 'The Moon is made of green cheese.', ARRAY['false', 'rock', 'stone'], 1, 'your-user-id');
```

**To use dynamic user ID (easier):**

```sql
INSERT INTO cases (category, statement, answer_keywords, difficulty, created_by)
SELECT
  'Logic', 'The Earth is flat.', ARRAY['false', 'sphere', 'round'], 1, auth.uid()
WHERE auth.uid() IS NOT NULL;
```

## Step 5: Verify Setup

Run these queries to verify everything is set up correctly:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check profiles
SELECT * FROM profiles LIMIT 5;

-- Check cases
SELECT * FROM cases LIMIT 5;

-- Check player_progress
SELECT * FROM player_progress LIMIT 5;
```

## Step 6: Configure Supabase Settings

1. Go to **Settings** → **Auth Providers**
2. Ensure **Email** is enabled for authentication
3. Go to **Settings** → **URL Configuration**
4. Add your app domain/localhost to the allowed redirect URLs

---

## Troubleshooting

**"Permission denied" on queries?**

- Check that RLS policies are correctly applied
- Ensure you're authenticated (have a valid JWT token)

**"Unique constraint violation" on username?**

- Usernames must be unique; try a different one

**Tables don't appear?**

- Refresh the Supabase dashboard
- Check that the SQL executed without errors

---

## Next Steps

Once tables are created and seeded:

1. Update `.env` with your Supabase credentials
2. Run `npm run dev`
3. The app will initialize the Supabase client automatically
4. Proceed to Day 3–4 (Game Components)
