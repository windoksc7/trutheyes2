import React, { useState } from "react";
import type { Case } from "../types";

interface GameBoardProps {
  currentCase: Case;
  submitAnswer: (answer: string) => void;
  submitting?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentCase,
  submitAnswer,
  submitting,
}) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // prevent double submit
    submitAnswer(answer);
    setAnswer("");
  };

  return (
    <div className="game-board" style={{ position: "relative" }}>
      <h2>Case Statement:</h2>
      <p className="case-statement">{currentCase.statement}</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your truth/lie here..."
          rows={5}
          required
        ></textarea>
        <button
          type="submit"
          disabled={submitting || answer.trim().length === 0}
        >
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>
      </form>

      {submitting && (
        <div className="submit-overlay" aria-hidden>
          <div className="spinner" role="status">
            <span className="sr-only">Submitting...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
