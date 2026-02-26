import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import LeaderboardTable from "../components/LeaderboardTable";
import ErrorBanner from "../components/ErrorBanner";

interface LeaderboardEntry {
  user_id: string;
  games_won: number;
  total_score: number;
  username?: string; // Will be joined from profiles
}

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: progressData, error: progressError } = await supabase
        .from("player_progress")
        .select("user_id, result, score")
        .eq("result", "WIN");

      if (progressError) throw progressError;

      const aggregatedLeaderboard = progressData.reduce(
        (acc, entry) => {
          if (!acc[entry.user_id]) {
            acc[entry.user_id] = {
              user_id: entry.user_id,
              games_won: 0,
              total_score: 0,
            };
          }
          acc[entry.user_id].games_won += 1;
          acc[entry.user_id].total_score += entry.score;
          return acc;
        },
        {} as Record<string, LeaderboardEntry>,
      );

      const sortedLeaderboard = Object.values(aggregatedLeaderboard)
        .sort((a, b) => b.total_score - a.total_score)
        .slice(0, 10);

      const userIds = sortedLeaderboard.map((entry) => entry.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const profilesMap = new Map<string, string>();
      profilesData.forEach((profile) =>
        profilesMap.set(profile.id, profile.username),
      );

      const finalLeaderboard = sortedLeaderboard.map((entry) => ({
        ...entry,
        username: profilesMap.get(entry.user_id) || "Unknown User",
      }));

      setLeaderboard(finalLeaderboard);
    } catch (err: any) {
      setError(err.message || String(err));
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-10">
      <div className="w-full max-w-4xl p-8 bg-card rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-card-foreground mb-6 text-center">Leaderboard (Top 10)</h2>
        {loading && <p className="text-center text-muted-foreground">Loading leaderboard...</p>}
        {error && <ErrorBanner message={error} onRetry={fetchLeaderboard} />}
        {!loading && leaderboard.length === 0 && (
          <p className="text-center text-muted-foreground">No players on the leaderboard yet. Play some games to get ranked!</p>
        )}
        {!loading && leaderboard.length > 0 && (
          <LeaderboardTable entries={leaderboard} />
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
