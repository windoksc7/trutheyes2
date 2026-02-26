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

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard (Top 10)</h2>
      {error && <ErrorBanner message={error} onRetry={fetchLeaderboard} />}

      {leaderboard.length === 0 ? (
        <p>No players on the leaderboard yet. Play some games to get ranked!</p>
      ) : (
        <LeaderboardTable entries={leaderboard} />
      )}
    </div>
  );
};

export default LeaderboardPage;
