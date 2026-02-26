import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import type { Case, PlayerProgress } from "../types";
import { useAuth } from "../auth/useAuth";

type GameState = "SELECT_CASE" | "IN_GAME" | "RESULT";

interface GameLogicHook {
  gameState: GameState;
  currentCase: Case | null;
  playerScore: number;
  message: string;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  cases: Case[];
  selectCase: (caseId: string) => void;
  submitAnswer: (answer: string) => void;
  resetGame: () => void;
  fetchCases: () => Promise<void>;
}

const useGameLogic = (): GameLogicHook => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>("SELECT_CASE");
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("cases")
      .select("*");

    if (fetchError) {
      setError(fetchError.message);
      console.error("Error fetching cases:", fetchError.message);
    } else if (data) {
      setCases(data as Case[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const selectCase = useCallback(
    (caseId: string) => {
      const selected = cases.find((c) => c.id === caseId);
      if (selected) {
        setCurrentCase(selected);
        setGameState("IN_GAME");
        setMessage("");
        setPlayerScore(0); // Reset score for new round
      } else {
        setError("Case not found.");
      }
    },
    [cases],
  );

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (submitting) return;
      setSubmitting(true);
      if (!currentCase) return;

      // Simple keyword matching logic
      const isCorrect = currentCase.answer_keywords.some((keyword) =>
        answer.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (isCorrect) {
        setMessage("Correct!");
        setPlayerScore(currentCase.difficulty * 10); // Example scoring
      } else {
        setMessage("Incorrect!");
        setPlayerScore(0);
      }
      setGameState("RESULT");

      try {
        // Log score to DB if user is authenticated
        if (user && currentCase) {
          const { error: logError } = await supabase
            .from("player_progress")
            .insert({
              user_id: user.id,
              case_id: currentCase.id,
              result: isCorrect ? "WIN" : "LOSE",
              score: isCorrect ? currentCase.difficulty * 10 : 0,
            } as PlayerProgress);

          if (logError) {
            console.error("Error logging player progress:", logError.message);
            setError("Failed to log score.");
          }
        }
      } finally {
        setSubmitting(false);
      }
    },
    [currentCase, user],
  );

  const resetGame = useCallback(() => {
    setCurrentCase(null);
    setGameState("SELECT_CASE");
    setMessage("");
    setPlayerScore(0);
    setError(null);
    fetchCases(); // Re-fetch cases in case they changed
  }, [fetchCases]);

  return {
    gameState,
    currentCase,
    playerScore,
    message,
    loading,
    submitting,
    error,
    cases,
    selectCase,
    submitAnswer,
    resetGame,
    fetchCases,
  };
};

export default useGameLogic;
