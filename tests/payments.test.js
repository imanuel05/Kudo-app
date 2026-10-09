const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const test = require('node:test');

process.env.SUPABASE_URL = 'https://supabase.example';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.DOKU_CLIENT_ID = 'test-client-id';
process.env.DOKU_SECRET_KEY = 'test-secret-key';
process.env.DOKU_ENV = 'sandbox';
process.env.APP_URL = 'https://kudo.example';

const {
  createDokuSignature,
  verifyDokuNotification,
} = require('../lib/payments');
const createPayment = require('../api/payments/create');
const notifyPayment = require('../api/payments/notification');
const submitPaymentProof = require('../api/payments/proof');
const paymentHistory = require('../api/payments/history');

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: '',
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = body || '';
    },
  };
}

test('payment history is authenticated and returns only the current user orders', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  const recentOrderDate = new Date().toISOString();
  const expiredOrderDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: 'current-user' }) };
    }
    return {
      ok: true,
      text: async () => JSON.stringify([
        {
          invoice_number: 'KUDO-00000000-0000-4000-8000-000000000000',
          diamonds: 1200,
          amount_idr: 10000,
          status: 'awaiting_verification',
          created_at: recentOrderDate,
        },
        {
          invoice_number: 'KUDO-00000000-0000-4000-8000-000000000001',
          diamonds: 2000,
          amount_idr: 15000,
          status: 'paid',
          created_at: expiredOrderDate,
        },
      ]),
    };
  };

  try {
    const response = createResponse();
    await paymentHistory(
      { method: 'GET', headers: { authorization: 'Bearer access-token' } },
      response
    );

    assert.equal(response.statusCode, 200);
    const history = JSON.parse(response.body).orders;
    assert.equal(history.length, 1);
    assert.deepEqual(history[0], {
      invoiceNumber: 'KUDO-00000000-0000-4000-8000-000000000000',
      diamonds: 1200,
      amount: 10000,
      status: 'awaiting_verification',
      createdAt: recentOrderDate,
    });
    assert.match(calls[1].url, /user_id=eq\.current-user/);
    assert.match(calls[1].url, /order=created_at\.desc/);
    const historyQuery = new URL(calls[1].url).searchParams;
    const requestedCutoff = Date.parse(historyQuery.get('created_at').slice(4));
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    assert.ok(requestedCutoff <= thirtyDaysAgo);
    assert.ok(requestedCutoff >= thirtyDaysAgo - 1000);
  } finally {
    global.fetch = originalFetch;
  }
});

test('DOKU notification signatures reject tampered bodies', () => {
  const body = Buffer.from(JSON.stringify({
    order: { invoice_number: 'KUDO-00000000-0000-4000-8000-000000000000', amount: 10000 },
  }));
  const timestamp = new Date().toISOString();
  const headers = {
    'client-id': process.env.DOKU_CLIENT_ID,
    'request-id': 'notification-1',
    'request-timestamp': timestamp,
  };
  headers.signature = createDokuSignature(
    headers['client-id'],
    headers['request-id'],
    timestamp,
    '/api/payments/notification',
    body,
    process.env.DOKU_SECRET_KEY
  );

  assert.equal(verifyDokuNotification({ headers }, body), true);
  assert.equal(verifyDokuNotification({ headers }, Buffer.from(`${body} `)), false);
  assert.equal(
    verifyDokuNotification({
      headers: {
        'Client-Id': headers['client-id'],
        'Request-Id': headers['request-id'],
        'Request-Timestamp': headers['request-timestamp'],
        Signature: headers.signature,
      },
    }, body),
    true
  );
});

test('payment creation uses the fixed price and restricts DOKU Checkout to DOKU Wallet', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: 'user-id', email: 'user@example.com' }) };
    }
    if (url === 'https://api-sandbox.doku.com/checkout/v1/payment') {
      const request = JSON.parse(options.body);
      const expectedAmount = request.order.line_items[0].id === 'DIAMOND-1200'
        ? 10
        : 15000;
      assert.equal(request.order.amount, expectedAmount);
      assert.equal(request.order.invoice_number.startsWith('KUDO-'), true);
      assert.equal(request.order.line_items[0].price, expectedAmount);
      assert.equal(request.customer.email, 'user@example.com');
      assert.deepEqual(request.payment.payment_method_types, ['EMONEY_DOKU']);
      const headers = options.headers;
      assert.match(headers['Request-Id'], /^KUDO-[0-9a-f-]{36}$/i);
      assert.match(headers['Request-Timestamp'], /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/);
      assert.equal(
        headers.Signature,
        createDokuSignature(
          headers['Client-Id'],
          headers['Request-Id'],
          headers['Request-Timestamp'],
          '/checkout/v1/payment',
          options.body,
          process.env.DOKU_SECRET_KEY
        )
      );
      return {
        ok: true,
        json: async () => ({
          response: { payment: { url: 'https://checkout-sandbox.doku.com/redirect' } },
        }),
      };
    }
    return { ok: true, status: 201, text: async () => '' };
  };

  try {
    const response = createResponse();
    await createPayment(
      {
        method: 'POST',
        headers: { authorization: 'Bearer test-token' },
        body: { packId: '1200', amount: 1, amountIdr: 1 },
      },
      response
    );
    assert.equal(response.statusCode, 201);
    const storedOrder = calls.find(({ url, options }) => url.endsWith('/rest/v1/payment_orders')
      && options.method === 'POST');
    assert.equal(JSON.parse(storedOrder.options.body).amount_idr, 10);
    const result = JSON.parse(response.body);
    assert.equal(result.diamonds, 1200);
    assert.equal(result.checkoutUrl, 'https://checkout-sandbox.doku.com/redirect');
    assert.equal(
      calls.some(({ url }) => url.includes('/checkout/v1/payment')),
      true
    );
    assert.equal(
      calls.some(({ url, options }) => url.endsWith('/rest/v1/payment_orders')
        && options.method === 'POST'),
      true
    );

    const responseFromStringBody = createResponse();
    await createPayment(
      {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-token' },
        body: JSON.stringify({ packId: '2000' }),
      },
      responseFromStringBody
    );
    assert.equal(responseFromStringBody.statusCode, 201);
    assert.equal(JSON.parse(responseFromStringBody.body).diamonds, 2000);
  } finally {
    global.fetch = originalFetch;
  }
});

test('QRIS order creation does not call DOKU Checkout', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: 'user-id', email: 'user@example.com' }) };
    }
    return { ok: true, status: 201, text: async () => '' };
  };

  try {
    const response = createResponse();
    await createPayment(
      {
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: { packId: '1200', paymentMethod: 'qris' },
      },
      response
    );

    assert.equal(response.statusCode, 201);
    assert.deepEqual(Object.keys(JSON.parse(response.body)).sort(), [
      'amount',
      'diamonds',
      'invoiceNumber',
    ]);
    assert.equal(JSON.parse(response.body).amount, 10);
    assert.equal(calls.some(({ url }) => url.includes('/checkout/v1/payment')), false);
    const orderRequest = calls.find(({ url }) => url.endsWith('/rest/v1/payment_orders'));
    assert.equal(JSON.parse(orderRequest.options.body).amount_idr, 10);
    assert.equal(JSON.parse(orderRequest.options.body).status, 'pending');
  } finally {
    global.fetch = originalFetch;
  }
});

test('QRIS proof registration accepts files without a minimum size and leaves diamonds pending verification', async () => {
  const originalFetch = global.fetch;
  const userId = '00000000-0000-4000-8000-000000000001';
  const invoiceNumber = 'KUDO-00000000-0000-4000-8000-000000000000';
  const proofPath = `${userId}/${invoiceNumber}/proof-00000000-0000-4000-8000-000000000002.png`;
  let orderUpdate;
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: userId }) };
    }
    if (url.includes('/storage/v1/object/info/payment-proofs/')) {
      return {
        ok: true,
        json: async () => ({ metadata: { mimetype: 'image/png', size: 0 } }),
      };
    }
    if (url.includes('/rest/v1/payment_orders?')) {
      orderUpdate = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{ status: orderUpdate.status }]),
      };
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await submitPaymentProof(
      {
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: { invoiceNumber, proofPath },
      },
      response
    );

    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), { status: 'awaiting_verification' });
    assert.equal(orderUpdate.status, 'awaiting_verification');
    assert.equal(orderUpdate.proof_path, proofPath);
  } finally {
    global.fetch = originalFetch;
  }
});

test('QRIS proof registration accepts storage metadata with contentLength and contentType', async () => {
  const originalFetch = global.fetch;
  const userId = '00000000-0000-4000-8000-000000000001';
  const invoiceNumber = 'KUDO-00000000-0000-4000-8000-000000000000';
  const proofPath = `${userId}/${invoiceNumber}/proof-00000000-0000-4000-8000-000000000002.jpg`;
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: userId }) };
    }
    if (url.includes('/storage/v1/object/info/payment-proofs/')) {
      return {
        ok: true,
        json: async () => ({ metadata: { contentType: 'image/jpeg', contentLength: 1024 } }),
      };
    }
    if (url.includes('/rest/v1/payment_orders?')) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{ status: 'awaiting_verification' }]),
      };
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await submitPaymentProof(
      {
        method: 'POST',
        headers: { authorization: 'Bearer test-user-token' },
        body: { invoiceNumber, proofPath },
      },
      response
    );

    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), { status: 'awaiting_verification' });
  } finally {
    global.fetch = originalFetch;
  }
});

test('QRIS proof registration rejects an image that is not in private storage', async () => {
  const originalFetch = global.fetch;
  const userId = '00000000-0000-4000-8000-000000000001';
  const invoiceNumber = 'KUDO-00000000-0000-4000-8000-000000000000';
  const proofPath = `${userId}/${invoiceNumber}/proof-00000000-0000-4000-8000-000000000002.png`;
  let orderWasUpdated = false;
  global.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: userId }) };
    }
    if (url.includes('/storage/v1/object/info/payment-proofs/')) {
      return { ok: false, status: 404 };
    }
    if (url.includes('/rest/v1/payment_orders?')) orderWasUpdated = true;
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await submitPaymentProof(
      {
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' },
        body: { invoiceNumber, proofPath },
      },
      response
    );

    assert.equal(response.statusCode, 400);
    assert.equal(orderWasUpdated, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test('DOKU Checkout errors are surfaced as safe codes and the order is marked failed', async () => {
  const originalFetch = global.fetch;
  let orderStatusUpdate;
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: 'user-id', email: 'user@example.com' }) };
    }
    if (url.endsWith('/checkout/v1/payment')) {
      return {
        ok: false,
        status: 500,
        json: async () => ({
          message: ['Payment channel unavailable'],
          error: { code: 'CHANNEL_NOT_ENABLED' },
          secret: 'must-not-be-logged-or-returned',
        }),
      };
    }
    if (url.includes('/rest/v1/payment_orders?')) {
      orderStatusUpdate = JSON.parse(options.body);
      return { ok: true, status: 204, text: async () => '' };
    }
    return { ok: true, status: 201, text: async () => '' };
  };

  const logged = [];
  const originalConsoleError = console.error;
  console.error = (...args) => logged.push(args.join(' '));
  try {
    const response = createResponse();
    await createPayment(
      {
        method: 'POST',
        headers: { authorization: 'Bearer test-token' },
        body: { packId: '1200' },
      },
      response
    );

    assert.equal(response.statusCode, 502);
    assert.deepEqual(JSON.parse(response.body), {
      error: 'DOKU belum dapat membuat pembayaran (kode: CHANNEL_NOT_ENABLED).',
      errorCode: 'CHANNEL_NOT_ENABLED',
    });
    assert.deepEqual(orderStatusUpdate, { status: 'failed' });
    assert.equal(logged.join(' ').includes('must-not-be-logged-or-returned'), false);
  } finally {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
  }
});

test('valid DOKU success notification calls the idempotent fulfillment RPC', async () => {
  const originalFetch = global.fetch;
  let rpcRequest;
  const notification = {
    order: {
      invoice_number: 'KUDO-00000000-0000-4000-8000-000000000000',
      amount: '10000',
    },
    transaction: { status: 'SUCCESS', original_request_id: 'doku-transaction' },
  };
  const rawBody = Buffer.from(JSON.stringify(notification));
  const timestamp = new Date().toISOString();
  const headers = {
    'client-id': process.env.DOKU_CLIENT_ID,
    'request-id': 'notification-2',
    'request-timestamp': timestamp,
  };
  headers.signature = createDokuSignature(
    headers['client-id'],
    headers['request-id'],
    timestamp,
    '/api/payments/notification',
    rawBody,
    process.env.DOKU_SECRET_KEY
  );
  global.fetch = async (input, options = {}) => {
    rpcRequest = { url: String(input), body: JSON.parse(options.body) };
    return { ok: true, status: 200, text: async () => '[]' };
  };

  try {
    const request = Readable.from([rawBody]);
    request.method = 'POST';
    request.headers = headers;
    const response = createResponse();
    await notifyPayment(request, response);
    assert.equal(response.statusCode, 200);
    assert.equal(rpcRequest.url.endsWith('/rest/v1/rpc/fulfill_diamond_payment'), true);
    assert.equal(rpcRequest.body.p_amount_idr, 10000);
    assert.equal(rpcRequest.body.p_transaction_id, 'doku-transaction');
  } finally {
    global.fetch = originalFetch;
  }
});
