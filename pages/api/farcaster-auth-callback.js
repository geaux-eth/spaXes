// Handles Neynar OAuth callback, exchanges code for user info, then sends a postMessage to the opener window
import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  const apiKey = process.env.NEY_API_KEY;
  if (!code) {
    res.status(400).send('Missing code');
    return;
  }
  try {
    // Exchange code for user info
    const { data } = await axios.post('https://api.neynar.com/v2/oauth2/token', {
      client_id: apiKey,
      client_secret: apiKey, // Neynar uses API key as both
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${req.headers.origin}/api/farcaster-auth-callback`,
    });
    // Render a page that sends user info to opener window and closes itself
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <script>
        window.opener && window.opener.postMessage({ farcasterUser: ${JSON.stringify(data)} }, window.origin);
        window.close();
      </script>
      <p>Login successful! You can close this window.</p>
    `);
  } catch (err) {
    res.status(500).send('Farcaster login failed.');
  }
}
