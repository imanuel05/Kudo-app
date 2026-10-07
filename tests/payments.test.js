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
  createDokuSignatureWithoutDigest,
  verifyDokuNotification,
} = require('../lib/payments');
const createPayment = require('../api/payments/create');
const notifyPayment = require('../api/payments/notification');

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
});

test('payment creation uses the fixed price and returns LinkAja POST redirect data', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: 'user-id', email: 'user@example.com' }) };
    }
    if (url === 'https://api-sandbox.doku.com/linkaja-emoney/v2/ServiceRequestPayment') {
      const request = JSON.parse(options.body);
      assert.equal(request.order.amount, 10000);
      assert.equal(request.order.invoice_number.startsWith('KUDO-'), true);
      assert.equal(request.order.line_items[0].price, 10000);
      assert.equal(request.customer.email, 'user@example.com');
      const headers = options.headers;
      assert.equal(
        headers.Signature,
        createDokuSignatureWithoutDigest(
          headers['Client-Id'],
          headers['Request-Id'],
          headers['Request-Timestamp'],
          '/linkaja-emoney/v2/ServiceRequestPayment',
          process.env.DOKU_SECRET_KEY
        )
      );
      return {
        ok: true,
        text: async () => JSON.stringify({
          order: {
            invoice_number: request.order.invoice_number,
            amount: '10000.00',
          },
          emoney_payment: {
            redirect_method_http: 'POST',
            redirect_url_http: 'https://api-uat.doku.com/linkaja/redirect',
            redirect_parameter: [{ name: 'Message', value: 'encoded-message' }],
            status: 'PENDING',
          },
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
    const result = JSON.parse(response.body);
    assert.equal(result.diamonds, 1200);
    assert.equal(result.redirectMethod, 'POST');
    assert.equal(result.redirectUrl, 'https://api-uat.doku.com/linkaja/redirect');
    assert.deepEqual(result.redirectParameters, [{ name: 'Message', value: 'encoded-message' }]);
    assert.equal(
      calls.some(({ url }) => url.includes('/checkout/v1/payment')),
      false
    );
    assert.equal(
      calls.some(({ url, options }) => url.endsWith('/rest/v1/payment_orders')
        && options.method === 'POST'),
      true
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('DOKU LinkAja errors are surfaced as safe codes and the order is marked failed', async () => {
  const originalFetch = global.fetch;
  let orderStatusUpdate;
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) {
      return { ok: true, json: async () => ({ id: 'user-id', email: 'user@example.com' }) };
    }
    if (url.endsWith('/linkaja-emoney/v2/ServiceRequestPayment')) {
      return {
        ok: false,
        status: 500,
        text: async () => JSON.stringify({
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
      error: 'DOKU belum dapat membuat pembayaran LinkAja (kode: CHANNEL_NOT_ENABLED).',
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
