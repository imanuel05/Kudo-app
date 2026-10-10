const assert = require('node:assert/strict');
const test = require('node:test');

process.env.SUPABASE_URL = 'https://supabase.example';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

const adminAccess = require('../api/admin/access');
const adminOrders = require('../api/admin/orders');
const adminVideos = require('../api/admin/videos');

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

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

test('admin access rejects authenticated users not in the admin list', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (input) => {
    if (String(input).endsWith('/auth/v1/user')) return jsonResponse({ id: 'regular-user' });
    return jsonResponse([]);
  };

  try {
    const response = createResponse();
    await adminAccess({ method: 'GET', headers: { authorization: 'Bearer token' } }, response);
    assert.equal(response.statusCode, 403);
    assert.deepEqual(JSON.parse(response.body), { error: 'Akses khusus admin.' });
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin QRIS verification checks admin membership before calling fulfillment RPC', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) return jsonResponse({ id: 'admin-user' });
    if (url.includes('/rest/v1/admin_users')) {
      return jsonResponse([{ user_id: 'admin-user' }]);
    }
    if (url.endsWith('/rest/v1/rpc/verify_qris_payment')) {
      return jsonResponse({ status: 'paid' });
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await adminOrders({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: { invoiceNumber: 'KUDO-00000000-0000-4000-8000-000000000000' },
    }, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), { status: 'paid' });
    const rpc = calls.find(({ url }) => url.endsWith('/rest/v1/rpc/verify_qris_payment'));
    assert.deepEqual(JSON.parse(rpc.options.body), {
      p_invoice_number: 'KUDO-00000000-0000-4000-8000-000000000000',
    });
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin QRIS rejection records rejection without calling diamond fulfillment', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) return jsonResponse({ id: 'admin-user' });
    if (url.includes('/rest/v1/admin_users')) return jsonResponse([{ user_id: 'admin-user' }]);
    if (url.endsWith('/rest/v1/rpc/reject_qris_payment')) return jsonResponse({ status: 'rejected' });
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await adminOrders({
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: {
        invoiceNumber: 'KUDO-00000000-0000-4000-8000-000000000000',
        action: 'reject',
      },
    }, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), { status: 'rejected' });
    assert.equal(calls.some(({ url }) => url.endsWith('/rest/v1/rpc/fulfill_diamond_payment')), false);
    const rpc = calls.find(({ url }) => url.endsWith('/rest/v1/rpc/reject_qris_payment'));
    assert.deepEqual(JSON.parse(rpc.options.body), {
      p_invoice_number: 'KUDO-00000000-0000-4000-8000-000000000000',
    });
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin payment endpoint rejects unsupported order actions', async () => {
  const originalFetch = global.fetch;
  let rpcCalled = false;
  global.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) return jsonResponse({ id: 'admin-user' });
    if (url.includes('/rest/v1/admin_users')) return jsonResponse([{ user_id: 'admin-user' }]);
    if (url.includes('/rest/v1/rpc/')) rpcCalled = true;
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await adminOrders({
      method: 'POST',
      headers: { authorization: 'Bearer admin-token' },
      body: {
        invoiceNumber: 'KUDO-00000000-0000-4000-8000-000000000000',
        action: 'refund',
      },
    }, response);
    assert.equal(response.statusCode, 400);
    assert.deepEqual(JSON.parse(response.body), { error: 'Tindakan transaksi tidak valid.' });
    assert.equal(rpcCalled, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin order listing signs private payment proofs for review', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) return jsonResponse({ id: 'admin-user' });
    if (url.includes('/rest/v1/admin_users')) {
      return {
        ok: true,
        text: async () => JSON.stringify([{ user_id: 'admin-user' }]),
      };
    }
    if (url.includes('/rest/v1/payment_orders')) {
      const status = new URL(url).searchParams.get('status');
      return {
        ok: true,
        text: async () => JSON.stringify(status === 'in.(paid,rejected)' ? [{
          invoice_number: 'KUDO-00000000-0000-4000-8000-000000000001',
          user_id: 'verified-customer',
          diamonds: 2000,
          amount_idr: 15000,
          status: 'paid',
          created_at: '2026-10-07T00:00:00.000Z',
          paid_at: '2026-10-08T00:00:00.000Z',
          rejected_at: null,
        }, {
          invoice_number: 'KUDO-00000000-0000-4000-8000-000000000002',
          user_id: 'rejected-customer',
          diamonds: 1200,
          amount_idr: 10,
          status: 'rejected',
          created_at: '2026-10-06T00:00:00.000Z',
          paid_at: null,
          rejected_at: '2026-10-08T01:00:00.000Z',
        }] : [{
          invoice_number: 'KUDO-00000000-0000-4000-8000-000000000000',
          user_id: 'customer-user',
          diamonds: 1200,
          amount_idr: 10000,
          status: 'awaiting_verification',
          proof_path: 'customer-user/KUDO-00000000-0000-4000-8000-000000000000/proof-00000000-0000-4000-8000-000000000000.png',
          created_at: '2026-10-08T00:00:00.000Z',
        }]),
      };
    }
    if (url.includes('/storage/v1/object/sign/payment-proofs/')) {
      return {
        ok: true,
        text: async () => JSON.stringify({ signedURL: '/object/sign/payment-proofs/proof.png?token=temporary' }),
      };
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await adminOrders({ method: 'GET', headers: { authorization: 'Bearer token' } }, response);
    assert.equal(response.statusCode, 200);
    const result = JSON.parse(response.body);
    assert.match(result.orders[0].proofUrl, /^https:\/\/supabase\.example\/storage\/v1\/object\/sign\//);
    assert.deepEqual(result.verifiedOrders[0], {
      invoiceNumber: 'KUDO-00000000-0000-4000-8000-000000000001',
      userId: 'verified-customer',
      diamonds: 2000,
      amount: 15000,
      status: 'paid',
      createdAt: '2026-10-07T00:00:00.000Z',
      verifiedAt: '2026-10-08T00:00:00.000Z',
    });
    assert.deepEqual(result.verifiedOrders[1], {
      invoiceNumber: 'KUDO-00000000-0000-4000-8000-000000000002',
      userId: 'rejected-customer',
      diamonds: 1200,
      amount: 10,
      status: 'rejected',
      createdAt: '2026-10-06T00:00:00.000Z',
      verifiedAt: '2026-10-08T01:00:00.000Z',
    });
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin video insertion validates the uploaded storage object before publishing metadata', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (input, options = {}) => {
    const url = String(input);
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) return jsonResponse({ id: 'admin-user' });
    if (url.includes('/rest/v1/admin_users')) {
      return jsonResponse([{ user_id: 'admin-user' }]);
    }
    if (url.includes('/storage/v1/object/info/catalog-video/')) {
      return jsonResponse({ metadata: { mimetype: 'video/mp4', size: 1024 } });
    }
    if (url.endsWith('/rest/v1/catalog_videos')) {
      return jsonResponse([JSON.parse(options.body)]);
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await adminVideos({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: {
        category: 'anime',
        showTitle: 'Licensed Series',
        episodeTitle: 'Episode 1',
        episodeNumber: 1,
        videoPath: 'admin-user/00000000-0000-4000-8000-000000000000.mp4',
      },
    }, response);
    assert.equal(response.statusCode, 201);
    assert.equal(JSON.parse(response.body).video.published, true);
    const insert = calls.find(({ url }) => url.endsWith('/rest/v1/catalog_videos'));
    assert.equal(JSON.parse(insert.options.body).show_title, 'Licensed Series');
    assert.equal(
      JSON.parse(insert.options.body).video_url,
      'https://supabase.example/storage/v1/object/public/catalog-video/admin-user/00000000-0000-4000-8000-000000000000.mp4',
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin video insertion rejects a storage path outside the signed-in administrator folder', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith('/auth/v1/user')) return jsonResponse({ id: 'admin-user' });
    if (url.includes('/rest/v1/admin_users')) return jsonResponse([{ user_id: 'admin-user' }]);
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = createResponse();
    await adminVideos({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: {
        category: 'kdrama',
        showTitle: 'Licensed Series',
        episodeTitle: 'Episode 1',
        episodeNumber: 1,
        videoPath: 'someone-else/00000000-0000-4000-8000-000000000000.mp4',
      },
    }, response);
    assert.equal(response.statusCode, 400);
  } finally {
    global.fetch = originalFetch;
  }
});
