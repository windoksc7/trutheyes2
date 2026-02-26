import React from "react";

interface LeaderboardEntry {
  user_id: string;
  games_won: number;
  total_score: number;
  username?: string;
}

interface Props {
  entries: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<Props> = ({ entries }) => {
  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Games Won</th>
          <th>Total Score</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={entry.user_id}>
            <td>{index + 1}</td>
            <td>{entry.username || "Unknown User"}</td>
            <td>{entry.games_won}</td>
            <td>{entry.total_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
