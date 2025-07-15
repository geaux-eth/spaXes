import { useState } from 'react';
import axios from 'axios';

export default function FarcasterLogin({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Start Neynar Quick Auth (opens a popup for Farcaster login)
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // This endpoint returns a URL for the Neynar Quick Auth popup
      const { data } = await axios.get('/api/farcaster-auth-url');
      const authWindow = window.open(data.url, '_blank', 'width=500,height=700');

      // Listen for message from the popup
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.farcasterUser) {
          onLogin(event.data.farcasterUser);
          window.removeEventListener('message', handleMessage);
          authWindow.close();
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (err) {
      setError('Failed to start Farcaster login.');
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', margin: '24px 0' }}>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in with Farcaster'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
