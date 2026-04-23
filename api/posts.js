export default async function handler(req, res) {
  // CORS headers — allow your website to call this function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const API_KEY = process.env.BEEHIIV_API_KEY;
  const PUB_ID = process.env.BEEHIIV_PUB_ID;

  if (!API_KEY || !PUB_ID) {
    res.status(500).json({ error: 'Missing Beehiiv credentials in environment variables.' });
    return;
  }

  const { postId, expand } = req.query;

  let url;
  if (postId) {
    // Fetch a single post with full content
    url = `https://api.beehiiv.com/v2/publications/${PUB_ID}/posts/${postId}?expand[]=free_web_content&expand[]=stats`;
  } else {
    // List all published posts
    url = `https://api.beehiiv.com/v2/publications/${PUB_ID}/posts?status=confirmed&expand[]=free_web_content&expand[]=stats&order_by=publish_date&direction=desc&limit=50`;
  }

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    // Cache for 15 minutes, serve stale while revalidating
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Beehiiv', details: error.message });
  }
}
