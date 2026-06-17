const { sign } = require('./_lib/auth');

const TOKEN_LIFETIME_MS = 12 * 60 * 60 * 1000; // 12 hours

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch { body = {}; }
  }
  body = body || {};

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    res.status(500).json({
      error: 'Admin panel is not configured yet. Set the ADMIN_PASSWORD environment variable in your Vercel project settings, then redeploy.'
    });
    return;
  }

  const { password } = body;

  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Incorrect password' });
    return;
  }

  const exp = Date.now() + TOKEN_LIFETIME_MS;
  const token = sign({ exp });

  res.status(200).json({ token, expires: exp });
};
