import React from 'react';
import type { Case } from '../types';

interface CaseSelectorProps {
  cases: Case[];
  selectCase: (caseId: string) => void;
  loading: boolean;
  error: string | null;
}

const CaseSelector: React.FC<CaseSelectorProps> = ({ cases, selectCase, loading, error }) => {
  if (loading) {
    return <div>Loading cases...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="case-selector">
      <h2>Select a Case to Play</h2>
      {cases.length === 0 ? (
        <p>No cases available. Please add some cases in the Supabase dashboard.</p>
      ) : (
        <ul>
          {cases.map((_case) => (
            <li key={_case.id}>
              <strong>{_case.statement}</strong> (Difficulty: {_case.difficulty})
              <button onClick={() => selectCase(_case.id)}>Play This Case</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CaseSelector;
