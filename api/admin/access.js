const { authorizeAdmin, respondUnauthorized } = require('../../lib/admin');
const { sendJson } = require('../../lib/payments');

module.exports = async function adminAccess(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const access = await authorizeAdmin(request);
    if (!access.user) return respondUnauthorized(response, access.status);
    return sendJson(response, 200, { isAdmin: true });
  } catch (error) {
    console.error('Could not check admin access:', error);
    return sendJson(response, 500, { error: 'Akses admin tidak dapat diperiksa.' });
  }
};
