const {
  authenticateRequest,
  sendJson,
  supabaseRequest,
} = require('../../lib/payments');

module.exports = async function paymentHistory(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const user = await authenticateRequest(request);
    if (!user?.id) return sendJson(response, 401, { error: 'Sesi login tidak valid.' });

    const query = new URLSearchParams({
      select: 'invoice_number,diamonds,amount_idr,status,created_at',
      user_id: `eq.${user.id}`,
      order: 'created_at.desc',
      limit: '100',
    });
    const orders = await supabaseRequest(`/rest/v1/payment_orders?${query}`);
    if (!Array.isArray(orders)) throw new Error('Payment history response was invalid.');

    return sendJson(response, 200, {
      orders: orders.map((order) => ({
        invoiceNumber: order.invoice_number,
        diamonds: order.diamonds,
        amount: order.amount_idr,
        status: order.status,
        createdAt: order.created_at,
      })),
    });
  } catch (error) {
    console.error('Could not load payment history:', error);
    return sendJson(response, 500, { error: 'Histori pembelian tidak dapat dimuat.' });
  }
};
