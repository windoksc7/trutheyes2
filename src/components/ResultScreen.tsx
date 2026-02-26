import React from 'react';

interface ResultScreenProps {
  message: string;
  playerScore: number;
  resetGame: () => void;
  playAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ message, playerScore, resetGame, playAgain }) => {
  return (
    <div className="result-screen">
      <h2>Round Over!</h2>
      <p>{message}</p>
      <p>Your Score: {playerScore}</p>
      <button onClick={playAgain}>Play Another Case</button>
      <button onClick={resetGame}>Go Back to Case Selection</button>
    </div>
  );
};

export default ResultScreen;
