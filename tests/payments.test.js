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

test('payment creation uses the server-side pack price and returns DOKU checkout URL', async () => {
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
      assert.equal(request.order.amount, 10000);
      assert.equal(request.order.invoice_number.startsWith('KUDO-'), true);
      return {
        ok: true,
        json: async () => ({
          response: { payment: { url: 'https://sandbox.doku.com/checkout/link/example' } },
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
    assert.equal(JSON.parse(response.body).diamonds, 1200);
    assert.equal(
      calls.some(({ url, options }) => url.endsWith('/rest/v1/payment_orders')
        && options.method === 'POST'),
      true
    );
  } finally {
    global.fetch = originalFetch;
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
