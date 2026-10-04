const crypto = require('crypto');

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};

  header.split(';').forEach((part) => {
    const index = part.indexOf('=');

    if (index === -1) return;

    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();

    cookies[key] = decodeURIComponent(value);
  });

  return cookies;
}

function createSession(user) {
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      name: user.name || '',
      picture: user.picture || '',
      providerId: user.sub,
      emailVerified: user.email_verified === true,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', process.env.KUDO_SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  return `${payload}.${signature}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const cookies = parseCookies(req);

    const code = req.query.code;
    const state = req.query.state;
    const savedState = cookies.kudo_oauth_state;

    if (!code || !state || !savedState || state !== savedState) {
      res.status(400).send('OAuth state tidak valid.');
      return;
    }

    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = forwardedProto
      ? String(forwardedProto).split(',')[0]
      : 'http';

    const host = req.headers.host;

    const redirectUri =
      `${protocol}://${host}/api/auth/callback/google`;

    const tokenResponse = await fetch(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();

      console.error('Google token error:', errorText);

      res.status(500).send('Gagal mendapatkan token Google.');
      return;
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      res.status(500).send('Access token Google tidak ditemukan.');
      return;
    }

    const userResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();

      console.error('Google userinfo error:', errorText);

      res.status(500).send('Gagal mengambil data akun Google.');
      return;
    }

    const user = await userResponse.json();

    if (!user.email) {
      res.status(400).send('Email Google tidak ditemukan.');
      return;
    }

    const session = createSession(user);

    const secureCookie = protocol === 'https:';

    const sessionCookie = [
      `kudo_session=${encodeURIComponent(session)}`,
      'HttpOnly',
      'SameSite=Lax',
      'Path=/',
      'Max-Age=604800',
      secureCookie ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');

    const clearStateCookie = [
      'kudo_oauth_state=',
      'HttpOnly',
      'SameSite=Lax',
      'Path=/',
      'Max-Age=0',
      secureCookie ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');

    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': [
        sessionCookie,
        clearStateCookie,
      ],
    });

    res.end();
  } catch (error) {
    console.error('Google OAuth callback error:', error);

    res.status(500).send('Terjadi kesalahan saat login dengan Google.');
  }
};