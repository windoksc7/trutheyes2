import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup(email, password, username);
      // Redirect to game or dashboard after successful signup
      console.log('User signed up successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-card-foreground mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
        <div className="form-group">
          <label className="text-muted-foreground" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-input border border-input rounded-md text-foreground"
          />
        </div>
        <div className="form-group">
          <label className="text-muted-foreground" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-input border border-input rounded-md text-foreground"
          />
        </div>
        <div className="form-group">
          <label className="text-muted-foreground" htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 bg-input border border-input rounded-md text-foreground"
          />
        </div>
        {error && <p className="text-destructive-foreground">{error}</p>}
        <button type="submit" disabled={loading} className="w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
