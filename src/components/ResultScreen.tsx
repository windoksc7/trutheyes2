import React from 'react';

type GameResult = 'WIN' | 'LOSE' | null;

interface ResultScreenProps {
  result: GameResult;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onReset }) => {
  if (!result) return null;

  const message = result === 'WIN' ? '완전 논파!' : '패배… 다시 도전하라';

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-foreground text-center">
        <h1 className="text-6xl mb-8 font-bold">{message}</h1>
        <button
          onClick={onReset}
          className="bg-primary text-primary-foreground text-xl py-3 px-6 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
