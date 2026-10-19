const {
  authenticateRequest,
  sendJson,
  supabaseRequest,
  supabaseRequestAll,
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

module.exports = async function paymentHistory(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const user = await authenticateRequest(request);
    if (!user?.id) return sendJson(response, 401, { error: 'Sesi login tidak valid.' });

    const query = new URLSearchParams({
      select: 'invoice_number,diamonds,amount_idr,status,proof_path,created_at,paid_at,rejected_at',
      user_id: `eq.${user.id}`,
      order: 'created_at.desc',
    });
    const orders = await supabaseRequestAll('/rest/v1/payment_orders', query);

    return sendJson(response, 200, {
      orders: await Promise.all(orders.map(async (order) => ({
        invoiceNumber: order.invoice_number,
        diamonds: order.diamonds,
        amount: order.amount_idr,
        status: order.status,
        createdAt: order.created_at,
        verifiedAt: order.paid_at || order.rejected_at || '',
        proofUrl: order.proof_path ? await signedProofUrl(order.proof_path) : '',
      }))),
    });
  } catch (error) {
    console.error('Could not load payment history:', error);
    return sendJson(response, 500, { error: 'Histori pembelian tidak dapat dimuat.' });
  }
};
