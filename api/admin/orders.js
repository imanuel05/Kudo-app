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

module.exports = async function adminOrders(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

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
          select: 'invoice_number,user_id,diamonds,amount_idr,status,created_at,paid_at',
          status: 'eq.paid',
          order: 'paid_at.desc.nullslast',
          limit: '100',
        })}`),
      ]);
      if (!Array.isArray(orders) || !Array.isArray(verifiedOrders)) {
        throw new Error('Admin payment order response was invalid.');
      }
      return sendJson(response, 200, {
        orders: await Promise.all(orders.map(async (order) => ({
          invoiceNumber: order.invoice_number,
          userId: order.user_id,
          diamonds: order.diamonds,
          amount: order.amount_idr,
          status: order.status,
          createdAt: order.created_at,
          proofUrl: order.proof_path ? await signedProofUrl(order.proof_path) : '',
        }))),
        verifiedOrders: verifiedOrders.map((order) => ({
          invoiceNumber: order.invoice_number,
          userId: order.user_id,
          diamonds: order.diamonds,
          amount: order.amount_idr,
          status: order.status,
          createdAt: order.created_at,
          verifiedAt: order.paid_at,
        })),
      });
    }

    const body = parseJsonBody(request.body);
    const invoiceNumber = String(body?.invoiceNumber || '');
    if (!/^KUDO-[0-9a-f-]{36}$/i.test(invoiceNumber)) {
      return sendJson(response, 400, { error: 'Nomor transaksi tidak valid.' });
    }
    const result = await supabaseRequest('/rest/v1/rpc/verify_qris_payment', {
      method: 'POST',
      body: JSON.stringify({ p_invoice_number: invoiceNumber }),
    });
    return sendJson(response, 200, { status: result?.status || 'paid' });
  } catch (error) {
    console.error('Admin payment verification failed:', error);
    return sendJson(response, 500, { error: 'Pembayaran tidak dapat diverifikasi.' });
  }
};
