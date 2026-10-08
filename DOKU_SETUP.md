# QRIS and DOKU diamond payments

The transaction page displays the QRIS image at `assets/qris-payment.png`.
Customers upload a payment-proof image to the private Supabase Storage bucket.
Submitting an image only changes the order to `awaiting_verification`; it never
credits diamonds. Verify that the payment arrived and matches the order amount
before approving it. DOKU Checkout endpoints remain available for DOKU
payments. Credentials and the Supabase service-role key must only be configured
as Vercel environment variables; never put them in `app.js`, commit them, or
send them in chat.

## One-time setup

1. Run the current [`supabase/schema.sql`](./supabase/schema.sql) in the
   Supabase SQL editor. It creates the private `payment_orders` table, the
   private `payment-proofs` Storage bucket with per-user upload policies, and
   the service-role-only payment verification and fulfillment functions. It
   also creates the admin allowlist, public video catalog, and video Storage
   bucket.
2. In Vercel project settings, configure these environment variables for QRIS:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. To approve a QRIS order, check that the payment arrived and matches the
   order amount, then run this in the Supabase SQL editor using a privileged
   database role:
   ```sql
   select public.verify_qris_payment('KUDO-<invoice-uuid>');
   ```
   This only credits an order in `awaiting_verification` that has an uploaded
   proof. Regular users cannot execute the verification function.
4. To give an account admin access, find its user UUID in Supabase
   Authentication > Users, then run this once in the SQL editor:
   ```sql
   insert into public.admin_users (user_id)
   values ('<auth-user-uuid>');
   ```
   Only add trusted administrators. The admin panel is available from Profile
   after the allowlist entry is created. It can review pending QRIS proofs,
   approve verified payments, and upload MP4/WebM videos up to 100 MB. Upload
   only video content you own or are licensed to distribute.
5. For DOKU Checkout, also configure:
   - `DOKU_CLIENT_ID` and `DOKU_SECRET_KEY` for the same environment, with
     DOKU Checkout and DOKU Wallet enabled by DOKU
   - `DOKU_ENV` (`sandbox` for testing; use `production` only after a successful
     sandbox test)
   - `APP_URL` (the deployed app origin, for example `https://kudo.example`)
6. In DOKU Back Office, set the payment notification URL to
   `https://<your-app-domain>/api/payments/notification`.
7. Deploy the Vercel project. Confirm the `api/` functions are included in the
   deployment and test DOKU sandbox payments before switching credentials to
   production.

DOKU prices and diamond quantities are selected from the fixed package list.
DOKU payments are credited only after a DOKU-signed success notification passes
signature, invoice, and amount checks. A database lock makes duplicate
notifications idempotent. The transaction page polls the authenticated status
endpoint and reloads account state after payment.

## Endpoints

- `POST /api/payments/create` — authenticated payment-order creation; body:
  `{ "packId": "1200", "paymentMethod": "qris" }` for QRIS, or
  `{ "packId": "1200" }` / `{ "packId": "2000" }` for DOKU Checkout.
- `GET /api/payments/status?invoice=<invoice>` — authenticated order status.
- `POST /api/payments/proof` — authenticated registration of an uploaded image
  from the private `payment-proofs` bucket.
- `GET /api/payments/history` — authenticated purchase history for the current
  user only.
- `POST /api/payments/notification` — DOKU notification endpoint.
- `GET /api/admin/access` — checks admin allowlist membership.
- `GET /api/admin/orders` and `POST /api/admin/orders` — lists proofs awaiting
  verification and approves a confirmed QRIS payment.
- `GET /api/admin/videos` and `POST /api/admin/videos` — lists and publishes
  admin-uploaded video catalog entries.
