const {
  readRawBody,
  sendJson,
  supabaseRequest,
  verifyDokuNotification,
} = require('../../lib/payments');

module.exports = async function dokuPaymentNotification(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const rawBody = await readRawBody(request);
    if (!verifyDokuNotification(request, rawBody)) {
      return sendJson(response, 401, { error: 'Invalid notification signature.' });
    }

    let notification;
    try {
      notification = JSON.parse(rawBody.toString('utf8'));
    } catch {
      return sendJson(response, 400, { error: 'Invalid notification body.' });
    }

    const invoiceNumber = notification?.order?.invoice_number;
    const amount = Number(notification?.order?.amount);
    const status = String(notification?.transaction?.status || '').toUpperCase();
    if (
      typeof invoiceNumber !== 'string'
      || !/^KUDO-[0-9a-f-]{36}$/i.test(invoiceNumber)
      || !Number.isSafeInteger(amount)
      || amount <= 0
    ) {
      return sendJson(response, 400, { error: 'Invalid order details.' });
    }

    if (status === 'SUCCESS') {
      const transactionId = String(
        notification?.transaction?.original_request_id
        || notification?.transaction?.request_id
        || request.headers['request-id']
        || ''
      ).slice(0, 128);
      await supabaseRequest('/rest/v1/rpc/fulfill_diamond_payment', {
        method: 'POST',
        body: JSON.stringify({
          p_invoice_number: invoiceNumber,
          p_amount_idr: amount,
          p_transaction_id: transactionId,
        }),
      });
    } else if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(status)) {
      const query = new URLSearchParams({
        invoice_number: `eq.${invoiceNumber}`,
        amount_idr: `eq.${amount}`,
        status: 'eq.pending',
      });
      await supabaseRequest(`/rest/v1/payment_orders?${query}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status.toLowerCase() }),
      });
    }

    return sendJson(response, 200, { message: 'Notification accepted.' });
  } catch (error) {
    console.error('DOKU payment notification failed:', error);
    return sendJson(response, 500, { error: 'Notification could not be processed.' });
  }
};

module.exports.config = { api: { bodyParser: false } };
