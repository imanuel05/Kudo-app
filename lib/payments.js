const { createHash, createHmac, randomUUID, timingSafeEqual } = require('node:crypto');

const DIAMOND_PACKS = Object.freeze({
  '1200': { diamonds: 1200, amountIdr: 10000 },
  '2000': { diamonds: 2000, amountIdr: 15000 },
});

function getHeaderValue(headers, name) {
  if (!headers || typeof headers !== 'object') return undefined;
  const target = String(name).toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (String(key).toLowerCase() === target) return value;
  }
  return undefined;
}

function parseJsonBody(value) {
  if (value === undefined || value === null) return {};
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return {};
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

function supabaseConfig() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase server configuration is incomplete.');
  }

  return {
    url: SUPABASE_URL.replace(/\/+$/, ''),
    anonKey: SUPABASE_ANON_KEY,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
  };
}

async function authenticateRequest(request) {
  const authorization = getHeaderValue(request.headers, 'authorization') || '';
  const token = String(authorization).match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return null;

  const config = supabaseConfig();
  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
}

async function supabaseRequest(path, options = {}) {
  const config = supabaseConfig();
  const response = await fetch(`${config.url}${path}`, {
    ...options,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!response.ok) {
    console.error('Supabase payment request failed:', response.status, body);
    throw new Error('Payment data could not be saved.');
  }
  return body;
}

async function isValidPaymentProofObject(objectPath) {
  const config = supabaseConfig();
  const encodedPath = objectPath.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(
    `${config.url}/storage/v1/object/info/payment-proofs/${encodedPath}`,
    {
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
    }
  );
  if (response.status === 404) return false;
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Supabase payment proof check failed:', response.status, errorBody);
    throw new Error('Payment proof could not be verified.');
  }

  const objectInfo = await response.json();
  const metadata = objectInfo?.metadata || {};
  const size = Number(metadata.size);
  return ['image/png', 'image/jpeg', 'image/webp'].includes(metadata.mimetype)
    && Number.isFinite(size)
    && size >= 0
    && size <= 5 * 1024 * 1024;
}

function getDokuConfig() {
  const { DOKU_CLIENT_ID, DOKU_SECRET_KEY, DOKU_ENV, APP_URL } = process.env;
  if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY || !APP_URL) {
    throw new Error('DOKU server configuration is incomplete.');
  }
  const environment = DOKU_ENV || 'sandbox';
  if (environment !== 'sandbox' && environment !== 'production') {
    throw new Error('DOKU_ENV must be sandbox or production.');
  }
  const appUrl = new URL(APP_URL);
  if (appUrl.protocol !== 'https:' || appUrl.username || appUrl.password) {
    throw new Error('APP_URL must be a secure HTTPS origin.');
  }

  return {
    clientId: DOKU_CLIENT_ID,
    secretKey: DOKU_SECRET_KEY,
    appUrl: appUrl.origin,
    apiUrl: environment === 'production'
      ? 'https://api.doku.com'
      : 'https://api-sandbox.doku.com',
  };
}

function createDokuSignature(clientId, requestId, timestamp, target, body, secretKey) {
  const digest = createHash('sha256').update(body).digest('base64');
  const rawSignature = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${target}`,
    `Digest:${digest}`,
  ].join('\n');
  return `HMACSHA256=${createHmac('sha256', secretKey).update(rawSignature).digest('base64')}`;
}

function verifyDokuNotification(request, rawBody) {
  const config = getDokuConfig();
  const clientId = getHeaderValue(request.headers, 'client-id');
  const requestId = getHeaderValue(request.headers, 'request-id');
  const timestamp = getHeaderValue(request.headers, 'request-timestamp');
  const signature = getHeaderValue(request.headers, 'signature');
  const timestampMs = Date.parse(timestamp);
  const maxAgeMs = 24 * 60 * 60 * 1000;

  if (
    clientId !== config.clientId
    || !requestId
    || !timestamp
    || !signature
    || !Number.isFinite(timestampMs)
    || Math.abs(Date.now() - timestampMs) > maxAgeMs
  ) {
    return false;
  }

  const expected = createDokuSignature(
    clientId,
    requestId,
    timestamp,
    '/api/payments/notification',
    rawBody,
    config.secretKey
  );
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length
    && timingSafeEqual(actualBytes, expectedBytes);
}

function createInvoiceNumber() {
  return `KUDO-${randomUUID()}`;
}

async function readRawBody(request, maxBytes = 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = {
  DIAMOND_PACKS,
  authenticateRequest,
  createDokuSignature,
  createInvoiceNumber,
  getDokuConfig,
  getHeaderValue,
  isValidPaymentProofObject,
  parseJsonBody,
  readRawBody,
  sendJson,
  supabaseRequest,
  verifyDokuNotification,
};
