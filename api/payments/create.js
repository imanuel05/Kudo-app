const { randomUUID } = require('node:crypto');
const {
  DIAMOND_PACKS,
  authenticateRequest,
  createDokuSignatureWithoutDigest,
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
        line_items: [{
          name: `${pack.diamonds.toLocaleString('id-ID')} Berlian Kudo`,
          price: pack.amountIdr,
          quantity: 1,
        }],
      },
      customer: {
        name: customerName,
        email: user.email,
      },
    };
    const body = JSON.stringify(requestBody);
    const requestId = randomUUID();
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const target = '/linkaja-emoney/v2/ServiceRequestPayment';
    const dokuResponse = await fetch(`${doku.apiUrl}${target}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': doku.clientId,
        'Request-Id': requestId,
        'Request-Timestamp': timestamp,
        Signature: createDokuSignatureWithoutDigest(
          doku.clientId,
          requestId,
          timestamp,
          target,
          doku.secretKey
        ),
      },
      body,
    });
    const dokuResponseText = await dokuResponse.text();
    let dokuResult;
    try {
      dokuResult = JSON.parse(dokuResponseText);
    } catch {
      dokuResult = null;
    }

    const linkajaPayment = dokuResult?.emoney_payment;
    const redirectUrl = linkajaPayment?.redirect_url_http;
    const redirectParameters = linkajaPayment?.redirect_parameter;
    let paymentUrl;
    try {
      paymentUrl = new URL(redirectUrl);
    } catch {
      paymentUrl = null;
    }

    if (
      !dokuResponse.ok
      || String(dokuResult?.order?.invoice_number || '') !== invoiceNumber
      || Number(dokuResult?.order?.amount) !== pack.amountIdr
      || linkajaPayment?.redirect_method_http !== 'POST'
      || paymentUrl?.protocol !== 'https:'
      || !paymentUrl.hostname
      || !Array.isArray(redirectParameters)
      || redirectParameters.length === 0
      || redirectParameters.length > 10
      || redirectParameters.some((parameter) => (
        typeof parameter?.name !== 'string'
        || !parameter.name
        || parameter.name.length > 100
        || typeof parameter?.value !== 'string'
        || parameter.value.length > 10000
      ))
    ) {
      const rawErrorCode = dokuResult?.error?.code
        || dokuResult?.response?.code
        || dokuResult?.code;
      const errorCode = typeof rawErrorCode === 'string'
        && /^[A-Za-z0-9_.-]{1,64}$/.test(rawErrorCode)
        ? rawErrorCode
        : 'INVALID_RESPONSE';
      console.error(
        'DOKU LinkAja payment creation failed:',
        JSON.stringify({ status: dokuResponse.status, code: errorCode })
      );
      await supabaseRequest(
        `/rest/v1/payment_orders?invoice_number=eq.${encodeURIComponent(invoiceNumber)}`,
        { method: 'PATCH', body: JSON.stringify({ status: 'failed' }) }
      );
      return sendJson(response, 502, {
        error: `DOKU belum dapat membuat pembayaran LinkAja (kode: ${errorCode}).`,
        errorCode,
      });
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
      redirectMethod: linkajaPayment.redirect_method_http,
      redirectUrl: paymentUrl.toString(),
      redirectParameters: redirectParameters.map(({ name, value }) => ({ name, value })),
    });
  } catch (error) {
    console.error('Could not create DOKU payment:', error);
    return sendJson(response, 500, { error: 'Pembayaran belum dapat dibuat. Silakan coba lagi.' });
  }
};
