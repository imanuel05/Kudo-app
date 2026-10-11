const { authorizeAdmin, respondUnauthorized } = require('../../lib/admin');
const {
  parseJsonBody,
  sendJson,
  supabaseRequest,
} = require('../../lib/payments');

function storagePath(path) {
  return String(path || '').split('/').map(encodeURIComponent).join('/');
}

async function signedProofUrl(proofPath) {
  const signed = await supabaseRequest(
    `/storage/v1/object/sign/payment-proofs/${storagePath(proofPath)}`,
    { method: 'POST', body: JSON.stringify({ expiresIn: 900 }) }
  );
  if (!signed?.signedURL) throw new Error('Payment proof URL was not returned.');
  const signedPath = signed.signedURL.startsWith('/storage/v1/')
    ? signed.signedURL
    : `/storage/v1${signed.signedURL.startsWith('/') ? '' : '/'}${signed.signedURL}`;
  return new URL(signedPath, process.env.SUPABASE_URL).toString();
}

async function loadUserNames(userIds) {
  const pendingIds = new Set(userIds.filter(Boolean).map(String));
  const names = new Map();
  let page = 1;

  while (pendingIds.size) {
    const result = await supabaseRequest(`/auth/v1/admin/users?${new URLSearchParams({
      page: String(page),
      per_page: '1000',
    })}`);
    const users = Array.isArray(result) ? result : result?.users;
    if (!Array.isArray(users)) throw new Error('Admin user response was invalid.');

    for (const user of users) {
      const userId = String(user.id || '');
      if (!pendingIds.has(userId)) continue;
      const metadata = user.user_metadata || {};
      const name = metadata.name || metadata.full_name || metadata.username;
      names.set(userId, typeof name === 'string' && name.trim() ? name.trim() : 'Pengguna');
      pendingIds.delete(userId);
    }

    if (users.length < 1000) break;
    page += 1;
  }

  return names;
}

module.exports = async function adminOrders(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  let action = 'verify';
  try {
    const access = await authorizeAdmin(request);
    if (!access.user) return respondUnauthorized(response, access.status);

    if (request.method === 'GET') {
      const [orders, verifiedOrders] = await Promise.all([
        supabaseRequest(`/rest/v1/payment_orders?${new URLSearchParams({
          select: 'invoice_number,user_id,diamonds,amount_idr,status,proof_path,created_at',
          status: 'eq.awaiting_verification',
          order: 'created_at.asc',
          limit: '100',
        })}`),
        supabaseRequest(`/rest/v1/payment_orders?${new URLSearchParams({
          select: 'invoice_number,user_id,diamonds,amount_idr,status,proof_path,created_at,paid_at,rejected_at',
          status: 'in.(paid,rejected)',
          order: 'created_at.desc',
          limit: '100',
        })}`),
      ]);
      if (!Array.isArray(orders) || !Array.isArray(verifiedOrders)) {
        throw new Error('Admin payment order response was invalid.');
      }
      const userNames = await loadUserNames([
        ...orders.map((order) => order.user_id),
        ...verifiedOrders.map((order) => order.user_id),
      ]);
      return sendJson(response, 200, {
        orders: await Promise.all(orders.map(async (order) => ({
          invoiceNumber: order.invoice_number,
          userId: order.user_id,
          userName: userNames.get(String(order.user_id)) || 'Pengguna tidak ditemukan',
          diamonds: order.diamonds,
          amount: order.amount_idr,
          status: order.status,
          createdAt: order.created_at,
          proofUrl: order.proof_path ? await signedProofUrl(order.proof_path) : '',
        }))),
        verifiedOrders: await Promise.all(verifiedOrders.map(async (order) => ({
          invoiceNumber: order.invoice_number,
          userId: order.user_id,
          userName: userNames.get(String(order.user_id)) || 'Pengguna tidak ditemukan',
          diamonds: order.diamonds,
          amount: order.amount_idr,
          status: order.status,
          createdAt: order.created_at,
          verifiedAt: order.paid_at || order.rejected_at,
          proofUrl: order.proof_path ? await signedProofUrl(order.proof_path) : '',
        }))),
      });
    }

    const body = parseJsonBody(request.body);
    const invoiceNumber = String(body?.invoiceNumber || '');
    action = body?.action || 'verify';
    if (!/^KUDO-[0-9a-f-]{36}$/i.test(invoiceNumber)) {
      return sendJson(response, 400, { error: 'Nomor transaksi tidak valid.' });
    }
    if (!['verify', 'reject'].includes(action)) {
      return sendJson(response, 400, { error: 'Tindakan transaksi tidak valid.' });
    }
    const rpcName = action === 'reject' ? 'reject_qris_payment' : 'verify_qris_payment';
    const result = await supabaseRequest(`/rest/v1/rpc/${rpcName}`, {
      method: 'POST',
      body: JSON.stringify({ p_invoice_number: invoiceNumber }),
    });
    return sendJson(response, 200, { status: result?.status || (action === 'reject' ? 'rejected' : 'paid') });
  } catch (error) {
    console.error('Admin payment action failed:', error);
    return sendJson(response, 500, {
      error: action === 'reject' ? 'Pembelian tidak dapat ditolak.' : 'Pembayaran tidak dapat diverifikasi.',
    });
  }
};
