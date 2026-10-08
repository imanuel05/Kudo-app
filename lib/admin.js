const { authenticateRequest, sendJson, supabaseRequest } = require('./payments');

async function authorizeAdmin(request) {
  const user = await authenticateRequest(request);
  if (!user?.id) return { user: null, status: 401 };

  const query = new URLSearchParams({
    select: 'user_id',
    user_id: `eq.${user.id}`,
    limit: '1',
  });
  const admins = await supabaseRequest(`/rest/v1/admin_users?${query}`);
  if (!Array.isArray(admins) || admins.length !== 1) {
    return { user: null, status: 403 };
  }
  return { user, status: 200 };
}

function respondUnauthorized(response, status) {
  return sendJson(response, status, {
    error: status === 401 ? 'Sesi login tidak valid.' : 'Akses khusus admin.',
  });
}

module.exports = { authorizeAdmin, respondUnauthorized };
