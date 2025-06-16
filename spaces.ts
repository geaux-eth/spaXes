export default async function handler(req, res) {
  const { username, state } = req.query;

  const userRes = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}`,
    {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
    }
  );
  const userData = await userRes.json();
  const userId = userData?.data?.id;
  if (!userId) return res.status(404).json({ error: 'User not found' });

  const spacesRes = await fetch(
    `https://api.twitter.com/2/spaces/by/creator_ids?user_ids=${userId}&state=${state}`,
    {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
    }
  );

  const data = await spacesRes.json();
  res.status(200).json(data);
}
