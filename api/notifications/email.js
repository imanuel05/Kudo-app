const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const {
  authenticateRequest,
  parseJsonBody,
  sendJson,
} = require('../../lib/payments');

const emailAttachments = [
  {
    filename: 'kudo-email-logo.png',
    content: readFileSync(join(__dirname, '../../assets/kudo-email-logo.png')).toString('base64'),
    content_id: 'kudo-logo',
  },
  {
    filename: 'email-reminder-art.png',
    content: readFileSync(join(__dirname, '../../assets/email-reminder-art.png')).toString('base64'),
    content_id: 'kudo-reminder-art',
  },
];

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
    const receivedAt = new Date(notification.createdAt).toLocaleString('id-ID');
    const messageHtml = escapeHtml(notification.message).replace(/\r?\n/g, '<br>');
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
        text: `${notification.message}\n\nDiterima: ${receivedAt}`,
        html: `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f7f7fb;font-family:Arial,sans-serif;color:#333652;"><table role="presentation" style="width:100%;max-width:560px;margin:0 auto;border-collapse:collapse;background:#fff;border:1px solid #ececf2;border-radius:16px;"><tr><td style="padding:24px 20px 8px;text-align:center;"><img src="cid:kudo-logo" width="112" height="112" alt="Kudo" style="display:block;width:112px;height:112px;margin:0 auto;object-fit:contain;"></td></tr><tr><td style="padding:0 20px 12px;text-align:center;"><img src="cid:kudo-reminder-art" width="360" alt="Anak-anak belajar bersama" style="display:block;width:100%;max-width:360px;height:auto;margin:0 auto;"></td></tr><tr><td style="padding:16px 24px 24px;"><h1 style="margin:0 0 12px;font-size:20px;line-height:1.4;color:#333652;">${escapeHtml(notification.title)}</h1><p style="margin:0;font-size:15px;line-height:1.6;color:#55566a;">${messageHtml}</p><p style="margin:20px 0 0;font-size:12px;color:#88899a;">Diterima: ${escapeHtml(receivedAt)}</p></td></tr></table></body></html>`,
        attachments: emailAttachments,
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

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char]
  );
}
