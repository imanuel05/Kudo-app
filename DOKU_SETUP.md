# DOKU LinkAja diamond payments

Diamond payments use the DOKU LinkAja E-Wallet Direct API (Non-SNAP), handled
by Vercel serverless functions. DOKU credentials and the Supabase service-role
key must only be configured as Vercel environment variables; never put them in
`app.js`, commit them, or send them in chat.

## One-time setup

1. Run the current [`supabase/schema.sql`](./supabase/schema.sql) in the
   Supabase SQL editor. It creates the private `payment_orders` table and the
   service-role-only, idempotent payment fulfillment function.
2. In Vercel project settings, configure these environment variables for the
   deployment:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DOKU_CLIENT_ID` and `DOKU_SECRET_KEY` for the same environment, with the
     LinkAja E-Wallet Non-SNAP product enabled by DOKU
   - `DOKU_ENV` (`sandbox` for testing; use `production` only after a successful
     sandbox test)
   - `APP_URL` (the deployed app origin, for example `https://kudo.example`)
3. In DOKU Back Office, set the payment notification URL to
   `https://<your-app-domain>/api/payments/notification`.
4. Ask DOKU to enable the LinkAja Non-SNAP API product for the merchant
   credentials used in the selected environment.
5. Deploy the Vercel project. Confirm the `api/` functions are included in the
   deployment and test with DOKU sandbox credentials and LinkAja sandbox.
6. Switch `DOKU_ENV` and credentials together to production after validating
   successful payment, failed payment, and duplicate notification behavior.

The server chooses prices and diamond quantities from the fixed package list
and creates a LinkAja payment using
`/linkaja-emoney/v2/ServiceRequestPayment`. The request signature follows the
LinkAja endpoint's documented Non-SNAP signature format (without a body
digest). The browser submits DOKU's returned HTTPS redirect URL and POST
parameters. It does not trust the browser's
displayed price. Diamonds are credited only after a DOKU-signed success
notification passes signature, invoice, and amount checks. A database lock
makes duplicate notifications idempotent. The transaction page polls the
authenticated status endpoint and reloads the account state after payment.

## Endpoints

- `POST /api/payments/create` — authenticated LinkAja payment creation; body:
  `{ "packId": "1200" }` or `{ "packId": "2000" }`.
- `GET /api/payments/status?invoice=<invoice>` — authenticated order status.
- `POST /api/payments/notification` — DOKU notification endpoint.
