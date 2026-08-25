# DuoSpace — Sync Phase 3.1 Site + Admin Release Manager

## Part 1 — Bring the uploaded site live

The zip contains only `src/marketing/**` (24 files: sections, components, data, motion helpers). The current project is an untouched TanStack Start template, so everything around those files must be created.

- Copy `src/marketing/**` into the project unchanged (no redesign, no animation changes).
- Install `framer-motion` (every section imports it; not currently in the project).
- Recreate the missing DuoSpace theme tokens in `src/styles.css`: `--surface-0`…`--surface-3`, `--shadow-pop`, registered in `@theme inline` so `bg-surface-1` etc. resolve. Palette tuned to match the existing `background/foreground/primary/border` tokens; light + dark values.
- Render `MarketingHome` at `/` by rewriting `src/routes/index.tsx`, and move its title/description into the route's `head()` (og/twitter included) instead of the `useEffect` document-title hack.

## Part 2 — Backend (Lovable Cloud)

Enable Lovable Cloud (database, auth, storage, server functions). There is no existing auth, schema or admin area, so this is greenfield.

**Roles** — separate `user_roles` table with an `app_role` enum (`admin`, `user`) plus a `has_role(uuid, app_role)` security-definer function. Roles are never stored on a profile row. A signup trigger grants `admin` to the very first registered user; every later signup gets `user`.

**Releases** — `app_releases` table: version, build_number, release_notes, apk_storage_path/filename/size/sha256, google_play_url, apple_app_store_url, ipa_url + ipa_label, web_url, status (`draft` | `published` | `archived`), timestamps, published_at, created_by. A partial unique index guarantees at most one `published` row.

**RLS** — anon/authenticated may SELECT only `status = 'published'`; all INSERT/UPDATE/DELETE restricted to `has_role(auth.uid(),'admin')`. Explicit GRANTs for anon/authenticated/service_role.

**Publishing** — a security-definer RPC `publish_release(id)` that archives the current published row and publishes the new one in one transaction, after re-checking admin role server-side.

**Storage** — public-read bucket `duospace-releases` with versioned paths `releases/<version>/<build>/duospace-<version>.apk`. Policies: public SELECT; INSERT/UPDATE/DELETE admin-only. No anonymous writes. Bucket file-size limit set generously (≥250 MB) so real APKs upload.

## Part 3 — Admin interface

- `/auth` — email+password sign-in only (no public sign-up flows on the marketing site beyond the account creation needed to bootstrap the first admin).
- `/admin/releases` under the auth-gated route layout, plus a role check that shows "Not authorized" for non-admins. Route protection is UX; RLS + the RPC are the real boundary.
- Release manager UI (clean, mobile-first, no marketing animation): current published release card, release history list, create/edit draft form, release preview, publish confirmation dialog, archive/delete with guards.
- APK upload: `.apk` extension + MIME check, ZIP magic-byte sniff (`PK\x03\x04`), size check before upload, live progress, SHA-256 computed in the browser via WebCrypto and stored on the row, retry on failure.
- URL validation with zod: Google Play must be `play.google.com`, App Store `apps.apple.com`, web/IPA must be `https:`. `javascript:`/`data:`/`file:` rejected. URLs only ever rendered as `href` attributes — no admin-supplied HTML rendered anywhere.
- IPA handled as an optional, clearly labelled "internal / testing build" reference — no fake "Install on iPhone" affordance.

## Part 4 — Public site wiring

- `downloadLinks.ts` stays, refactored into a fallback/config layer (env-configured links become the fallback, not the source of truth).
- A public server function reads the single published release through a publishable-key client (safe columns only — no `created_by`, no internal metadata) and is fetched once via TanStack Query in the route loader; nothing is tied to scroll or animation.
- `DownloadCTA` and `MarketingNav` keep their exact markup, styling and choreography — only the data source changes. Missing links continue to render the existing "Coming soon" state; a backend failure falls back to configured links, and if there are none the page still renders fully with download options marked unavailable.
- `guessPlatform()` behaviour preserved.

## Verification

Lint, typecheck and build; grep the built client bundle and source for `service_role` / `SUPABASE_SERVICE_ROLE_KEY`; check the public site and admin flow in a headless browser (create draft → validate → publish → public CTA updates). Real physical-phone testing is not possible from this environment — I will report responsive/emulated results only and say so plainly.

## Notes

- Screenshots/app imagery: the zip ships no image assets, so previews render from the existing code-drawn mockups. If you have real DuoSpace screenshots/logos, upload them and I'll wire them in afterwards.
