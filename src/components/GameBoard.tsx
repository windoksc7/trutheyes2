import React, { useState } from 'react';
import type { Case } from '../types';

interface HPBarProps {
  hp: number;
  maxHP: number;
  color: string; // Keep color for specific player/enemy distinction
}

const HPBar: React.FC<HPBarProps> = ({ hp, maxHP, color }) => (
  <div className="w-full h-5 bg-secondary rounded-full overflow-hidden border border-border">
    <div
      className="h-full rounded-full transition-all duration-500 ease-in-out"
      style={{
        width: `${(hp / maxHP) * 100}%`,
        backgroundColor: color,
      }}
    />
  </div>
);

interface GameBoardProps {
  currentCase: Case;
  submitAnswer: (answer: string) => void;
  submitting?: boolean;
  playerHP: number;
  enemyHP: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentCase,
  submitAnswer,
  submitting,
  playerHP,
  enemyHP,
}) => {
  const [argument, setArgument] = useState('');

  const handleAttack = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || argument.trim() === '') return;
    submitAnswer(argument);
    setArgument('');
  };

  return (
    <>
      <style>{`
        .case-statement-box::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 20px 20px 0;
          border-style: solid;
          border-color: hsl(var(--muted)) transparent transparent transparent;
        }
      `}</style>
      <div className="w-full max-w-2xl border-2 border-primary rounded-xl p-8 flex flex-col gap-8 bg-card text-card-foreground">
        {/* Enemy Section */}
        <div className="flex flex-col gap-3">
          <span className="text-2xl font-bold">Shadow Prosecutor</span>
          <HPBar hp={enemyHP} maxHP={3} color="#8b5cf6" />
        </div>

        {/* Case Statement */}
        <div className="case-statement-box bg-muted border-2 border-accent text-muted-foreground p-6 rounded-lg italic text-center relative text-lg leading-relaxed">
          <p>{currentCase.statement}</p>
        </div>

        {/* Player Section */}
        <div className="flex flex-col gap-3">
          <HPBar hp={playerHP} maxHP={3} color="#06b6d4" />
          <form onSubmit={handleAttack} className="w-full">
            <textarea
              className="w-full min-h-[100px] bg-input border border-input rounded-lg p-4 text-foreground text-base resize-y mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Your argument..."
              disabled={submitting}
            />
            <button
              type="submit"
              className="w-full bg-destructive text-destructive-foreground text-3xl font-bold rounded-lg py-4 px-8 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 disabled:bg-muted disabled:cursor-not-allowed"
              disabled={submitting || !argument.trim()}
            >
              {submitting ? "Submitting..." : "논파한다!"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default GameBoard;
