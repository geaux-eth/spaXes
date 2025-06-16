export default async function handler(req, res) {
  const { fid } = req.query;

  if (!fid) return res.status(400).json({ error: "Missing FID" });

  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': process.env.NEY_API_KEY
      }
    });

    const data = await response.json();

    const username = data.users?.[0]?.connected_accounts?.twitter?.username;

    if (!username) {
      return res.status(404).json({ error: 'No linked Twitter account found for this FID' });
    }

    res.status(200).json({ username });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}
