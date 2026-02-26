import { useEffect, useState, useCallback } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import type { Profile, AuthContextType } from "../types";

export const useAuth = (): Omit<
  AuthContextType,
  "login" | "signup" | "logout"
> & {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
} => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from DB
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error: err } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (err) {
        console.error("Error fetching profile:", err);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setUser(data.session.user);
          const prof = await fetchProfile(data.session.user.id);
          setProfile(prof);
        }
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user as any);
        const prof = await fetchProfile(session.user.id);
        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(err.message);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup
  const signup = useCallback(
    async (email: string, password: string, username: string) => {
      setError(null);
      setLoading(true);
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
          },
        );

        if (authError) {
          setError(authError.message);
          throw authError;
        }

        if (authData.user) {
          // Create profile entry
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              username,
              created_at: new Date().toISOString(),
            });

          if (profileError) {
            setError(profileError.message);
            throw profileError;
          }

          setUser(authData.user);
          const prof = await fetchProfile(authData.user.id);
          setProfile(prof);
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile],
  );

  // Logout
  const logout = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signOut();
      if (err) {
        setError(err.message);
        throw err;
      }
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    login,
    signup,
    logout,
  };
};
