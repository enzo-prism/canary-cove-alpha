# Private guest access

The `/guest` route is a server-rendered, fail-closed scaffold for future guest information. It currently contains only an approved placeholder; do not add private phone numbers, emergency contacts, itineraries, or documents until Don's final sketch and content are approved.

## Security boundary

- `proxy.ts` denies unauthenticated requests to `/guest/:path*` before rendering.
- `lib/guest-auth-dal.ts` revalidates the signed session inside every protected server page. Future route handlers, server actions, downloads, and data access must call the same DAL rather than relying on Proxy alone.
- Login and logout are same-origin Server Actions in `app/guest/actions.ts`.
- Password verification uses scrypt against `CANARY_GUEST_PASSWORD_HASH`; plaintext passwords do not belong in Vercel configuration or source.
- Sessions use an independent `CANARY_GUEST_SESSION_SECRET`, HMAC-SHA256 signatures, an eight-hour absolute expiry, and an `HttpOnly; Secure; SameSite=Strict; Path=/` cookie.
- Private responses are `private, no-store`, noindex, no-referrer, nosniff, and protected from framing.
- Google Analytics, Vercel Analytics, and the ElevenLabs widget are disabled for `/guest` through `components/public-runtime-services.tsx`.
- `/guest` is disallowed in `robots.txt` and remains absent from navigation, search, sitemap, and llms files. Those are discovery controls only, not authentication.

## Login rate limit

A Vercel WAF rule on the project (`Rate limit guest login`, id `rule_rate_limit_guest_login_HxFvlR`) denies `POST /guest/access` beyond **5 requests per 600s per IP**, in a fixed window. The denial happens at the edge and returns `429` with `x-vercel-mitigated: deny`, so the request never reaches `loginGuest()` and the form cannot render it as an inline error. `app/guest/error.tsx` catches the resulting client error and explains the wait.

Two consequences worth knowing before debugging a login report:

- Everyone behind one public IP shares the budget. Automated verification of the login flow will lock out a human on the same network for the rest of the window, and each further attempt refills a fixed window rather than draining it.
- Scripted checks of this flow should stay under five POSTs per ten minutes, or expect a `429` that looks like an application failure rather than a rate limit.

## Content rules

- Never place guest documents or private details in `public/`, client components, browser bundles, source maps, query strings, analytics, or logs.
- Fetch future sensitive content only from approved private server-side storage and gate every file/data endpoint with `requireGuestSession()`.
- Keep the GitHub repository private.

## Secret rotation

1. Generate a new high-entropy guest password and a separate random 32-byte session secret.
2. Store the plaintext guest password only in the approved password store.
3. Generate a scrypt hash with `createGuestPasswordHash()` from `lib/guest-password.ts` and set only the hash as `CANARY_GUEST_PASSWORD_HASH` in Vercel.
4. Set the independent signing key as the sensitive Vercel variable `CANARY_GUEST_SESSION_SECRET`.
5. Redeploy. Rotating the signing key immediately invalidates all existing sessions.

## Release gates

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright test e2e/private-guest-access.spec.ts --project=chromium
```

Production acceptance must verify anonymous denial, generic wrong-password failure, correct-password success, secure cookie attributes, refresh persistence, logout, tampered-cookie denial, no-store/noindex headers, no third-party trackers, and no bypass through nested guest paths or direct Vercel deployment aliases.
