// Game case/statement
export interface Case {
  id: string;
  category: string;
  statement: string;
  answer_keywords: string[];
  difficulty: 1 | 2 | 3;
  created_by: string;
  created_at: string;
}

// User profile metadata
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

// Game result/score tracking
export interface PlayerProgress {
  id: string;
  user_id: string;
  case_id: string;
  result: "WIN" | "LOSE";
  score: number;
  created_at: string;
}

// Auth context
export interface AuthContextType {
  user: any; // Supabase User type
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}
