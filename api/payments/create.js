const {
  DIAMOND_PACKS,
  authenticateRequest,
  createDokuSignature,
  createInvoiceNumber,
  getDokuConfig,
  sendJson,
  supabaseRequest,
} = require('../../lib/payments');

module.exports = async function createDiamondPayment(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const user = await authenticateRequest(request);
    if (!user?.id || !user.email) {
      return sendJson(response, 401, { error: 'Silakan masuk sebelum membeli berlian.' });
    }

    const pack = DIAMOND_PACKS[String(request.body?.packId || '')];
    if (!pack) return sendJson(response, 400, { error: 'Paket berlian tidak valid.' });

    const doku = getDokuConfig();
    const invoiceNumber = createInvoiceNumber();
    const order = {
      user_id: user.id,
      invoice_number: invoiceNumber,
      diamonds: pack.diamonds,
      amount_idr: pack.amountIdr,
      status: 'pending',
    };
    await supabaseRequest('/rest/v1/payment_orders', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(order),
    });

    const customerName = String(
      user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.email.split('@')[0]
    ).slice(0, 255);
    const requestBody = {
      order: {
        invoice_number: invoiceNumber,
        amount: pack.amountIdr,
        callback_url: `${doku.appUrl}/?payment=return#transaction`,
        currency: 'IDR',
        callback_url_result: `${doku.appUrl}/?payment=return#transaction`,
        auto_redirect: true,
        line_items: [{
          id: `DIAMOND-${pack.diamonds}`,
          name: `${pack.diamonds.toLocaleString('id-ID')} Berlian Kudo`,
          quantity: 1,
          price: pack.amountIdr,
        }],
      },
      payment: {
        payment_due_date: 60,
        payment_method_types: ['EMONEY_DOKU'],
      },
      customer: {
        name: customerName,
        email: user.email,
      },
    };
    const body = JSON.stringify(requestBody);
    const requestId = createInvoiceNumber();
    const timestamp = new Date().toISOString();
    const target = '/checkout/v1/payment';
    const dokuResponse = await fetch(`${doku.apiUrl}${target}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': doku.clientId,
        'Request-Id': requestId,
        'Request-Timestamp': timestamp,
        Signature: createDokuSignature(
          doku.clientId,
          requestId,
          timestamp,
          target,
          body,
          doku.secretKey
        ),
      },
      body,
    });
    const dokuResult = await dokuResponse.json();
    const checkoutUrl = dokuResult?.response?.payment?.url;
    if (!dokuResponse.ok || !checkoutUrl) {
      const rawErrorCode = dokuResult?.error?.code || dokuResult?.code;
      const errorCode = typeof rawErrorCode === 'string'
        && /^[A-Za-z0-9_.-]{1,64}$/.test(rawErrorCode)
        ? rawErrorCode
        : 'INVALID_RESPONSE';
      console.error(
        'DOKU Checkout payment creation failed:',
        dokuResponse.status,
        errorCode
      );
      await supabaseRequest(
        `/rest/v1/payment_orders?invoice_number=eq.${encodeURIComponent(invoiceNumber)}`,
        { method: 'PATCH', body: JSON.stringify({ status: 'failed' }) }
      );
      return sendJson(response, 502, {
        error: `DOKU belum dapat membuat pembayaran (kode: ${errorCode}).`,
        errorCode,
      });
    }

    const paymentUrl = new URL(checkoutUrl);
    if (
      paymentUrl.protocol !== 'https:'
      || (paymentUrl.hostname !== 'doku.com' && !paymentUrl.hostname.endsWith('.doku.com'))
    ) {
      throw new Error('DOKU returned an invalid checkout URL.');
    }

    await supabaseRequest(
      `/rest/v1/payment_orders?invoice_number=eq.${encodeURIComponent(invoiceNumber)}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ checkout_url: paymentUrl.toString() }),
      }
    );
    return sendJson(response, 201, {
      invoiceNumber,
      amount: pack.amountIdr,
      diamonds: pack.diamonds,
      checkoutUrl: paymentUrl.toString(),
    });
  } catch (error) {
    console.error('Could not create DOKU payment:', error);
    return sendJson(response, 500, { error: 'Pembayaran belum dapat dibuat. Silakan coba lagi.' });
  }
};
