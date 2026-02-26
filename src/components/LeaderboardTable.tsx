import React from 'react';

interface LeaderboardEntry {
  user_id: string;
  games_won: number;
  total_score: number;
  username?: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  return (
    <table className="w-full text-left border-collapse table-auto">
      <thead>
        <tr className="bg-secondary">
          <th className="p-4 border-b-2 border-border text-secondary-foreground">Rank</th>
          <th className="p-4 border-b-2 border-border text-secondary-foreground">Player</th>
          <th className="p-4 border-b-2 border-border text-secondary-foreground">Games Won</th>
          <th className="p-4 border-b-2 border-border text-secondary-foreground">Total Score</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={entry.user_id} className="even:bg-muted/50">
            <td className="p-4 border-b border-border">{index + 1}</td>
            <td className="p-4 border-b border-border">{entry.username}</td>
            <td className="p-4 border-b border-border">{entry.games_won}</td>
            <td className="p-4 border-b border-border">{entry.total_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;