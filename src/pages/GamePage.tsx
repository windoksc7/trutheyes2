
import React, { useState, useEffect } from 'react';
import useGameLogic from '../hooks/useGameLogic';
import CaseSelector from '../components/CaseSelector';
import GameBoard from '../components/GameBoard';
import ResultScreen from '../components/ResultScreen';

type GameResult = 'WIN' | 'LOSE' | null;

const GamePage: React.FC = () => {
  const {
    gameState,
    currentCase,
    message,
    loading,
    submitting,
    error,
    cases,
    selectCase,
    submitAnswer,
    resetGame,
  } = useGameLogic();

  const [playerHP, setPlayerHP] = useState(3);
  const [enemyHP, setEnemyHP] = useState(3);
  const [feedback, setFeedback] = useState<'CRITICAL!' | '논리 붕괴…' | ''>('');
  const [gameResult, setGameResult] = useState<GameResult>(null);

  useEffect(() => {
    if (gameState === 'RESULT') {
      if (message === 'Correct!') {
        setEnemyHP(hp => hp - 1);
        setFeedback('CRITICAL!');
        if (enemyHP <= 1) {
          setGameResult('WIN');
        }
      } else {
        setPlayerHP(hp => hp - 1);
        setFeedback('논리 붕괴…');
        if (playerHP <= 1) {
          setGameResult('LOSE');
        }
      }
    } else if (gameState === 'IN_GAME') {
        // Reset HP if it's a new case but not a reset of the same case
    }
  }, [gameState, message]);


  const handleSelectCase = (caseId: string) => {
    selectCase(caseId);
    // Resetting HP for a new case
    setPlayerHP(3);
    setEnemyHP(3);
    setFeedback('');
    setGameResult(null);
  };

  const handleReset = () => {
    resetGame();
    setPlayerHP(3);
    setEnemyHP(3);
    setFeedback('');
    setGameResult(null);
  };

  if (loading) {
    return <div className="text-foreground text-center pt-20">Loading Game...</div>;
  }

  if (error) {
    return <div className="text-destructive-foreground text-center pt-20">Error: {error}</div>;
  }

  return (
    <>
      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 0; transform: translate(-50%, -150%) scale(1.2); }
        }
        .feedback-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float-up 1.5s ease-out forwards;
        }
      `}</style>
      <div className="bg-background min-h-screen flex items-center justify-center font-sans p-4 relative">
        {gameState === 'SELECT_CASE' && <CaseSelector cases={cases} selectCase={handleSelectCase} loading={loading} error={error} />}
        
        {gameState === 'IN_GAME' && currentCase && (
          <GameBoard
            currentCase={currentCase}
            submitAnswer={submitAnswer}
            submitting={submitting}
            playerHP={playerHP}
            enemyHP={enemyHP}
          />
        )}
        
        {gameResult && <ResultScreen result={gameResult} onReset={handleReset} />}
        
        {feedback && (
          <div
            className={`feedback-text text-6xl font-bold pointer-events-none z-20 ${
              feedback === 'CRITICAL!' ? 'text-red-500' : 'text-slate-500'
            }`}>
            {feedback}
          </div>
        )}
      </div>
    </>
  );
};

export default GamePage;
