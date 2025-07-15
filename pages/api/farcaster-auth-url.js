// This API route returns a Neynar Quick Auth URL for Farcaster login
export default async function handler(req, res) {
  const apiKey = process.env.NEY_API_KEY;
  const redirectUri = `${req.headers.origin}/api/farcaster-auth-callback`;
  const url = `https://api.neynar.com/v2/oauth2/authorize?client_id=${apiKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+farcaster`;
  res.status(200).json({ url });
}
