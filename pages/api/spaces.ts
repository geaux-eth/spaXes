export default async function handler(req, res) {
  const { username, state } = req.query;

  if (!username || !state) {
    return res.status(400).json({ error: "Missing username or state" });
  }

  try {
    // Get the user ID from the username
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
      }
    );
    const userData = await userRes.json();
    const userId = userData?.data?.id;

    if (!userId) {
      return res.status(404).json({ error: 'Twitter user not found' });
    }

    // Get spaces by creator ID and state
    const spacesRes = await fetch(
      `https://api.twitter.com/2/spaces/by/creator_ids?user_ids=${userId}&state=${state}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
      }
    );

    const data = await spacesRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching spaces:", error);
    res.status(500).json({ error: "Failed to fetch spaces" });
  }
}
