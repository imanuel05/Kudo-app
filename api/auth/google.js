const crypto = require('crypto');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const state = crypto.randomBytes(32).toString('hex');

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = forwardedProto
    ? String(forwardedProto).split(',')[0]
    : 'http';

  const host = req.headers.host;
  const redirectUri =
    `${protocol}://${host}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  const googleUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const secureCookie = protocol === 'https:';

  const cookie = [
    `kudo_oauth_state=${state}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    'Max-Age=600',
    secureCookie ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  res.writeHead(302, {
    Location: googleUrl,
    'Set-Cookie': cookie,
  });

  res.end();
};