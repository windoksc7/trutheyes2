import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthGuard from './components/AuthGuard';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import GamePage from './pages/GamePage';
import { useAuth } from './auth/useAuth';
import { useState, useEffect } from 'react';

// Theme Switcher Component
const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button onClick={toggleTheme} className="p-2 rounded-md bg-secondary text-secondary-foreground">
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
    );
};

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="p-4 bg-card text-card-foreground shadow-md">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">TruthEyes</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-muted-foreground">{user.email}</span>
              <Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
              <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
              <button onClick={logout} className="p-2 rounded-md bg-destructive text-destructive-foreground">Logout</button>
            </>
          ) : (
            <>
              <Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link>
              <Link to="/game" className="hover:text-primary transition-colors">Game</Link>
            </>
          )}
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
};

function App() {
  useEffect(() => {
    // Set the theme on initial load
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Header />
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminPage />
            </AuthGuard>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
