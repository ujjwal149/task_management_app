# Email authentication

New local accounts are created only after email OTP verification. Google sign-in remains available and requires Google's verified-email claim; Google users do not need a second email OTP.

## Configure and deploy

1. Configure the server using `server/.env.example`, keeping your existing database, Google, Cloudinary, client URL, and JWT settings. Generate a **separate** random `OTP_SECRET` (at least 32 characters).
2. Create a Resend sending API key and verify your sending domain. Set `RESEND_API_KEY` and `EMAIL_FROM` on the server only. See [Resend email API](https://resend.com/docs/api-reference/emails/send-email) and [domain verification](https://resend.com/docs/dashboard/domains/introduction). Resend's test sender is restricted; use a verified domain for real recipients. Never put these values in `NEXT_PUBLIC_*` variables or commit `.env` files.
3. Back up the database, then run from `server`:

   ```sh
   npm ci
   npx prisma migrate deploy
   npx prisma generate
   npm run build
   ```

4. Build the client with its existing `NEXT_PUBLIC_API_URL` and deploy both server and client together. Keep the existing same-site HTTPS deployment for the HTTP-only authentication cookie. If behind a reverse proxy, set `TRUST_PROXY_HOPS` to the exact trusted hop count and ensure the proxy overwrites forwarded client-address headers. Do not set blanket proxy trust.
5. Smoke-test signup, sign-in by code, reset password, and Google sign-in using your own mailbox. Real email delivery and Google consent require your production credentials and cannot be validated by the automated tests.

## Existing accounts

The migration normalizes email addresses and stops if two accounts would collide after lowercasing/trimming. Resolve these collisions manually before retrying; accounts are never merged automatically.

Existing accounts are **not** assumed to have verified emails. Old sessions are invalidated. Existing users can sign in with an email code, reset their password with a code, or use verified Google sign-in. First verification through OTP login or Google clears any legacy, unverified password to prevent an attacker-chosen password from surviving an ownership claim. To continue using password login, use **Forgot password** to set a new password. Names, tasks, projects, and memberships remain intact.

## Endpoints

All paths are under `/api/auth`. OTP request responses contain a `challengeId`, `expiresIn`, `retryAfter`, and generic `message`; they never contain a code or authentication cookie.

| Endpoint | Body | Behavior |
| --- | --- | --- |
| `POST /signup` | `name`, `email`, `password` | Send signup code; no User created yet. Also used for resend. |
| `POST /signup/verify` | `email`, `challengeId`, `code` | Consume signup code, create verified account, set session cookie. |
| `POST /otp/request` | `email` | Send login code for an existing account. |
| `POST /otp/verify` | `email`, `challengeId`, `code` | Consume login code, verify email, set session cookie. |
| `POST /forgot-password` | `email` | Send reset code for an existing account, including Google accounts. |
| `POST /reset-password` | `email`, `challengeId`, `code`, `password` | Consume code, set password, revoke sessions and all outstanding codes. Does not automatically sign in. |

Codes are six cryptographically random digits, expire in 10 minutes, permit five incorrect attempts, and can be consumed only once. HMAC hashes bind codes to their email, purpose, and challenge. Resends replace the previous challenge, with a 60-second cooldown and five sends per email/purpose per hour. Shared database IP limits allow 20 sends, 60 verifications, and 30 password login attempts per 15 minutes. A generic eligible-email response reduces account disclosure; this is not a constant-time account-enumeration defense.

PostgreSQL advisory transaction locks serialize verification and issuance across server instances. Code consumption and account mutation are atomic. Request bodies, codes, passwords, and provider response bodies are not logged. Delivery failures invalidate that challenge while retaining send limits. Retry after the cooldown.

Password reset increments the user's session version. HTTP requests, WebSocket connections, incoming WebSocket messages, and outgoing WebSocket notifications check it against the database. Old JWTs are rejected even if unexpired.

## Maintenance

Periodically remove expired pending data, preserving active rate windows. These statements are suitable for an existing daily database maintenance job:

```sql
DELETE FROM "EmailOtp"
WHERE "expiresAt" < NOW() - INTERVAL '1 day'
  AND "windowStartedAt" < NOW() - INTERVAL '1 day';
DELETE FROM "AuthRateLimit"
WHERE "windowStartedAt" < NOW() - INTERVAL '1 day';
```

## Automated verification

Use a dedicated disposable PostgreSQL database with a name ending in `_test`. Never supply a production database:

```sh
cd server
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/taskflow_auth_test npm test
```

Tests apply migrations only to that test database and mock email delivery; they send no real email. They cover pending signup, validation, wrong/expired/reused/wrong-purpose codes, concurrent verification and resend, throttling, email failures, legacy users, Google verification, password reset, and session revocation.
