import React from 'react';
import type { Case } from '../types';

interface CaseSelectorProps {
  cases: Case[];
  selectCase: (caseId: string) => void;
  loading?: boolean;
  error?: string | null;
}

const CaseSelector: React.FC<CaseSelectorProps> = ({ cases, selectCase, loading, error }) => {
  if (loading) {
    return <div className="text-foreground">Loading cases...</div>;
  }

  if (error) {
    return <div className="text-destructive-foreground">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-card-foreground mb-6 text-center">Select a Case</h2>
      <ul className="space-y-4">
        {cases.map((caseItem) => (
          <li key={caseItem.id}>
            <button
              onClick={() => selectCase(caseItem.id)}
              className="w-full p-4 bg-secondary rounded-md text-secondary-foreground text-lg font-semibold hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 transition-colors duration-300"
            >
              {caseItem.statement}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseSelector;
