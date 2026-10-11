const { createHash } = require('node:crypto');
const {
  authenticateRequest,
  parseJsonBody,
  sendJson,
} = require('../../lib/payments');

function notificationFields(body) {
  const id = String(body?.id || '');
  const title = String(body?.title || '').replace(/[\r\n]+/g, ' ').trim();
  const message = String(body?.body || '').trim();
  const createdAt = String(body?.createdAt || '');

  if (
    !/^(task-moved|task-deadline)-[A-Za-z0-9_-]{1,160}$/.test(id)
    || !title
    || title.length > 120
    || !message
    || message.length > 1000
    || !Number.isFinite(Date.parse(createdAt))
  ) {
    return null;
  }

  return { id, title, message, createdAt };
}

module.exports = async function notificationEmail(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const user = await authenticateRequest(request);
    if (!user?.id || !user.email) {
      return sendJson(response, 401, { error: 'Sesi login atau email akun tidak valid.' });
    }

    const notification = notificationFields(parseJsonBody(request.body));
    if (!notification) {
      return sendJson(response, 400, { error: 'Data notifikasi tidak valid.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !sender) {
      return sendJson(response, 503, { error: 'Pengiriman email belum dikonfigurasi.' });
    }

    const idempotencyKey = createHash('sha256')
      .update(`${user.id}:${notification.id}`)
      .digest('hex');
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: sender,
        to: [user.email],
        subject: notification.title,
        text: `${notification.message}\n\nDiterima: ${new Date(notification.createdAt).toLocaleString('id-ID')}`,
      }),
    });

    if (!emailResponse.ok) {
      console.error('Resend rejected a notification email:', emailResponse.status);
      return sendJson(response, 502, { error: 'Email notifikasi tidak dapat dikirim.' });
    }

    return sendJson(response, 200, { sent: true });
  } catch (error) {
    console.error('Notification email failed:', error);
    return sendJson(response, 500, { error: 'Email notifikasi tidak dapat dikirim.' });
  }
};
