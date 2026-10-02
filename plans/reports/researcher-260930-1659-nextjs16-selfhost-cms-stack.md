# Research: Next.js 16.3 self-hosted CMS stack

Date: 2026-09-30. Sources: official docs fetched on that date. `node_modules` could not be read (project hook), so nothing was checked against installed package versions. Items marked **UNVERIFIED** need a smoke test.

## 1. Caching DB-backed pages (Next 16)

- `cacheComponents: true` (top-level in `next.config.ts`, Node runtime only). With it on, data access is dynamic by default. Uncached async work must sit in `'use cache'` or behind `<Suspense>`, otherwise dev reports a "blocking-route" error. `'use cache'` results are filled **during prerender, i.e. at build**.
- Loader pattern: a `'use cache'` function with `cacheTag('articles')` and `cacheLife('max')`.
- Invalidation from a Server Action: `updateTag(tag)`. It is Server-Action only and expires immediately (read-your-own-writes).
- `revalidateTag(tag, profile)`: the second argument is effectively required in v16. `'max'` gives stale-while-revalidate; `{ expire: 0 }` is meant for route handlers and webhooks.
- `generateStaticParams` under `cacheComponents` **must return at least one param**; an empty array is a build error. The documented workaround is a placeholder `[{ slug: '__placeholder__' }]` plus `notFound()`. `dynamicParams` defaults to true, so new slugs work at runtime.
- **Avoid DB access at build:**
  - Recommended: the placeholder param, plus a non-cached wrapper inside `<Suspense>` that does `await connection()` and then calls the cached loader. **UNVERIFIED** for exactly this use; confirm with a `next build` that has no `DATABASE_URL`.
  - Alternative: turn `cacheComponents` off and use the legacy model (docs guide "caching-without-cache-components", not read in full).
- Self-hosted cache: an in-memory LRU per instance, lost on restart (the key includes the build ID). This is fine for a single instance, and no `cacheHandler` is needed.
- Sources:
  - https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
  - https://nextjs.org/docs/app/api-reference/functions/updateTag
  - https://nextjs.org/docs/app/api-reference/functions/revalidateTag
  - https://nextjs.org/docs/app/api-reference/functions/generate-static-params
  - https://nextjs.org/docs/app/guides/self-hosting

## 2. `proxy.ts`

- Renamed from `middleware` in v16. It runs on Node, and setting `runtime` throws.
- Use `matcher: ['/admin/:path*']`. Server Action POSTs go to the page route, so any path excluded from the matcher also skips the proxy.
- Treat it as an optimistic redirect only. Check auth again in every page, loader and Server Action.
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy

## 3. Self-hosting

- `output: 'standalone'`. You must copy `public/` and `.next/static` into the image yourself, and set `PORT` and `HOSTNAME=0.0.0.0`. Use a multi-stage build on `node:24-slim`.
- `NEXT_PUBLIC_*` values are inlined at build time. Per-environment values must be server-side `process.env`, read at request time.
- `next.config` values (`images`, `serverActions`) are most likely frozen into the standalone `server.js` at build (**UNVERIFIED**). Keep per-environment values out of `next.config`.
- Server Actions:
  - `bodySizeLimit` defaults to 1 MB.
  - `allowedOrigins` compares `Origin` against `x-forwarded-host`/`host`. Behind Caddy it is usually not needed, but test it.
- Add `sharp` explicitly. Whether standalone traces it automatically is **UNVERIFIED**.
- Image optimizer:
  - `qualities` defaults to `[75]`.
  - `minimumCacheTTL` defaults to 4 h, and the effective TTL is the maximum of that and the upstream max-age.
  - The disk cache is at `<distDir>/cache/images`, so mount `/app/.next/cache` writable for `USER node`.
  - SVG is blocked unless `dangerouslyAllowSVG` is set.

## 4. Same-origin media (`/media/[...key]`)

- The design is sound for "one image, many environments", because the bucket host never appears in `next.config`.
- Config: `images.localPatterns: [{ pathname: '/media/**', search: '' }, { pathname: '/images/**', search: '' }]`. Omitting `search` allows any query string.
- **UNVERIFIED:** whether the optimizer accepts an internal `src` served by a route handler rather than a file in `public/`.
  - Smoke test in the standalone container: `/_next/image?url=%2Fmedia%2F<key>&w=640&q=75` must return 200 with an image content type.
  - Fallback: `unoptimized` for media images, or a custom loader.
- Route handler requirements:
  - Stream the body with `Response(body.transformToWebStream())`.
  - Send `Cache-Control: public, max-age=31536000, immutable` and the correct `Content-Type`.
  - Validate the key strictly and return 404 on a missing object.
  - Use immutable UUID keys.

## 5. Drizzle and Postgres

- Driver: `pg` Pool (the Drizzle default) held as a `globalThis` singleton. The same TCP driver works with Neon when `sslmode=require` is set.
- Neon scale-to-zero after 5 idle minutes means a slow first connect. Set a generous connect timeout and retry once.
- Run migrations with the direct (non-pooler) Neon URL.
- Flow: `drizzle-kit generate` produces committed SQL in `drizzle/`, and `drizzle-kit migrate` applies it. **Never** use `push` in production. The standalone image does not contain the migrator, so use a separate Docker stage and run it as a one-shot Compose service.
- `jsonb().$type<T>()` is compile-time only, so validate with zod. `text().array()` exists.
- https://orm.drizzle.team/docs/get-started/postgresql-new
- https://orm.drizzle.team/docs/connect-neon

## 6. Better Auth (minimum)

- Drizzle adapter with `provider: 'pg'`. The import path has changed between versions, so check the installed one.
- Role: `user.additionalFields.role` with `input: false`, or use the `admin` plugin, which provides user-management APIs such as ban, setRole and setUserPassword.
- Next.js: `toNextJsHandler(auth)` in `app/api/auth/[...all]/route.ts`, and put the `nextCookies()` plugin last. In server code, get the session with `auth.api.getSession({ headers: await headers() })`.
- https://www.better-auth.com/docs/integrations/next

## 7. R2

- S3 client: `region: 'auto'`, endpoint `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.
- Recent AWS SDK v3 versions add checksums by default, which may break R2 (**UNVERIFIED**). Set `requestChecksumCalculation: 'WHEN_REQUIRED'`.
- `r2.dev` public URLs are rate-limited and intended for development only. A private bucket read through the app avoids that entirely.
- Free tier: 10 GB-month of storage, 1M Class A and 10M Class B operations per month, and free egress.
- R2 supports object lifecycle expiration rules. This is from memory; confirm it in the dashboard.
- https://developers.cloudflare.com/r2/pricing/

## 8. Free demo hosting

- **Render free:**
  - Spins down after 15 idle minutes, with a wake-up of about 1 minute.
  - Ephemeral filesystem and no persistent disk.
  - Free Postgres expires after 30 days.
  - https://render.com/docs/free
- **Neon free:**
  - 0.5 GB per project and 100 CU-hours per project per month.
  - Scale-to-zero after 5 minutes is mandatory.
  - https://neon.com/docs/introduction/plans
- **Oracle Always Free:**
  - Ampere A1 **ARM**, with an allocation of 2 OCPU/12 GB or 4 OCPU/24 GB (**UNVERIFIED** which is current).
  - Oracle reclaims an idle instance if its CPU, network and memory all stay below 20% at p95 over 7 days. Upgrading the account to Pay As You Go removes this risk.
  - A1 capacity is often unavailable.
  - https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm

## 9. Caddy and Docker

- Minimal `Caddyfile`: `{$SITE_DOMAIN} { encode zstd gzip; reverse_proxy app:3210 }`.
- Persist the `/data` volume to keep certificates.
- Publish ports only on Caddy. Published ports bypass ufw, because Docker's `nat` table handles them before ufw's rules apply.
- https://docs.docker.com/engine/network/packet-filtering-firewalls/
- https://caddyserver.com/docs/quick-starts/reverse-proxy
