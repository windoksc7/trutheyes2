import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthGuard from "./components/AuthGuard";
import { useAuth } from "./auth/useAuth";

// Game components
import useGameLogic from "./hooks/useGameLogic";
import CaseSelector from "./components/CaseSelector";
import GameBoard from "./components/GameBoard";
import ResultScreen from "./components/ResultScreen";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminPage from "./pages/AdminPage";

// Placeholder for the main game content page
const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome to TruthEyes!</h1>
      {user ? (
        <>
          <p>Logged in as {user.email}</p>
          <button onClick={logout}>Logout</button>
          <nav>
            <Link to="/game">Start Game</Link> {" | "}
            <Link to="/leaderboard">Leaderboard</Link> {" | "}
            <Link to="/admin">Admin</Link>
          </nav>
        </>
      ) : (
        <nav>
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>{" "}
          {" | "}
          <Link to="/leaderboard">Leaderboard</Link>
        </nav>
      )}
    </div>
  );
};

// Placeholder for the Game page
const GamePage = () => {
  const {
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
  } = useGameLogic();

  useEffect(() => {
    // Optionally, if cases need to be re-fetched when GamePage mounts
    // For now, useGameLogic handles initial fetch
  }, [fetchCases]);

  if (loading) {
    return <div>Loading game...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="game-container">
      {gameState === "SELECT_CASE" && (
        <CaseSelector
          cases={cases}
          selectCase={selectCase}
          loading={loading}
          error={error}
        />
      )}
      {gameState === "IN_GAME" && currentCase && (
        <GameBoard
          currentCase={currentCase}
          submitAnswer={submitAnswer}
          submitting={submitting}
        />
      )}
      {gameState === "RESULT" && (
        <ResultScreen
          message={message}
          playerScore={playerScore}
          resetGame={resetGame}
          playAgain={() => selectCase(currentCase!.id)} // Assuming currentCase is not null here
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* Protected routes */}
      <Route
        path="/game"
        element={
          <AuthGuard>
            <GamePage />
          </AuthGuard>
        }
      />
      <Route
        path="/admin"
        element={
          <AuthGuard>
            {/* AdminPage is imported dynamically to avoid circular imports */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <React.Suspense fallback={<div>Loading admin...</div>}>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <AdminPage />
            </React.Suspense>
          </AuthGuard>
        }
      />
      {/* Add other protected routes here */}
    </Routes>
  );
}

export default App;
