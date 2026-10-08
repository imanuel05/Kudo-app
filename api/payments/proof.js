const {
  authenticateRequest,
  isValidPaymentProofObject,
  parseJsonBody,
  sendJson,
  supabaseRequest,
} = require('../../lib/payments');

module.exports = async function submitDiamondPaymentProof(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const parsedBody = parseJsonBody(request.body);
    if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
      return sendJson(response, 400, { error: 'Bukti pembayaran tidak valid.' });
    }

    const user = await authenticateRequest(request);
    if (!user?.id) return sendJson(response, 401, { error: 'Sesi login tidak valid.' });

    const invoiceNumber = String(parsedBody.invoiceNumber || '');
    const proofPath = String(parsedBody.proofPath || '');
    if (!/^KUDO-[0-9a-f-]{36}$/i.test(invoiceNumber)) {
      return sendJson(response, 400, { error: 'Nomor transaksi tidak valid.' });
    }

    const pathPattern = new RegExp(
      `^${user.id}/${invoiceNumber}/proof-[0-9a-f-]{36}\\.(png|jpg|webp)$`,
      'i'
    );
    if (!pathPattern.test(proofPath)) {
      return sendJson(response, 400, { error: 'Lokasi bukti pembayaran tidak valid.' });
    }
    if (!await isValidPaymentProofObject(proofPath)) {
      return sendJson(response, 400, { error: 'File bukti harus berupa gambar maksimal 5 MB.' });
    }

    const query = new URLSearchParams({
      invoice_number: `eq.${invoiceNumber}`,
      user_id: `eq.${user.id}`,
      status: 'eq.pending',
    });
    const updatedOrders = await supabaseRequest(`/rest/v1/payment_orders?${query}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        status: 'awaiting_verification',
        proof_path: proofPath,
        proof_uploaded_at: new Date().toISOString(),
      }),
    });
    if (!Array.isArray(updatedOrders) || updatedOrders.length !== 1) {
      return sendJson(response, 409, { error: 'Pesanan tidak ditemukan atau sudah diproses.' });
    }

    return sendJson(response, 200, { status: 'awaiting_verification' });
  } catch (error) {
    console.error('Could not save QRIS payment proof:', error);
    return sendJson(response, 500, { error: 'Bukti pembayaran belum dapat disimpan.' });
  }
};
