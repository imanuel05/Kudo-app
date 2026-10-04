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

function verifySession(token) {
  if (!token) return null;

  const parts = token.split('.');

  if (parts.length !== 2) return null;

  const [payload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.KUDO_SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    );

    if (!data.exp || Date.now() > data.exp) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const cookies = parseCookies(req);
  const session = verifySession(cookies.kudo_session);

  if (!session) {
    res.status(200).json({
      authenticated: false,
    });
    return;
  }

  res.status(200).json({
    authenticated: true,
    user: {
      email: session.email,
      name: session.name,
      picture: session.picture,
      providerId: session.providerId,
      emailVerified: session.emailVerified,
    },
  });
};