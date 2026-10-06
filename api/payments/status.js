const {
  authenticateRequest,
  sendJson,
  supabaseRequest,
} = require('../../lib/payments');

module.exports = async function diamondPaymentStatus(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const user = await authenticateRequest(request);
    if (!user?.id) return sendJson(response, 401, { error: 'Sesi login tidak valid.' });

    const invoiceNumber = String(request.query?.invoice || '');
    if (!/^KUDO-[0-9a-f-]{36}$/i.test(invoiceNumber)) {
      return sendJson(response, 400, { error: 'Nomor transaksi tidak valid.' });
    }

    const query = new URLSearchParams({
      select: 'invoice_number,diamonds,amount_idr,status',
      invoice_number: `eq.${invoiceNumber}`,
      user_id: `eq.${user.id}`,
      limit: '1',
    });
    const orders = await supabaseRequest(`/rest/v1/payment_orders?${query}`);
    const order = orders?.[0];
    if (!order) return sendJson(response, 404, { error: 'Transaksi tidak ditemukan.' });
    return sendJson(response, 200, {
      invoiceNumber: order.invoice_number,
      diamonds: order.diamonds,
      amount: order.amount_idr,
      status: order.status,
    });
  } catch (error) {
    console.error('Could not read DOKU payment status:', error);
    return sendJson(response, 500, { error: 'Status pembayaran tidak dapat dimuat.' });
  }
};
