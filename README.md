# Dr. Bouamara Dental Clinic — website & admin dashboard

A production-grade Next.js application for Dr. Bouamara Dental Clinic: a public
website with a real appointment-request system, plus a custom admin dashboard
for managing appointments, messages and site content.

It started from the MIT-licensed **WhitePearl** dental template (see
[`NOTICE.md`](./NOTICE.md)) — the routing skeleton, Tailwind foundation and a
few layout patterns were kept, while the visual identity, content, architecture,
booking engine, authentication and dashboard are new.

---

## 1. Current status — read this first

The site is a **complete, working foundation**, not a finished clinic website.
Real clinic information was deliberately **not invented**. Anything unknown is a
clearly-marked placeholder.

| Area | State |
|---|---|
| Public website (6 pages + legal) | ✅ Built, responsive, accessible, builds cleanly |
| Appointment system | ✅ Real slot generation, conflict detection, validation, persistence |
| Admin dashboard | ✅ Custom, protected, with live KPIs and a readiness report |
| Supabase architecture | ✅ Schema, RLS, constraints, views, seed SQL included (project not created yet) |
| Authentication | ✅ Supabase Auth wired; demo session available for local preview |
| Clinic name / logo | ⚠️ Text wordmark `Dr. Bouamara` — final logo still to be supplied |
| Phone, email, address, hours | ⚠️ Placeholders, labelled as such across the UI |
| Photography | ⚠️ Branded placeholders (no stock imagery is bundled — see §10) |
| Practitioner profiles, reviews, policies | ⚠️ Placeholder slots, no invented content |

Every placeholder is tracked in `src/content/site.ts` → `PLACEHOLDER_FIELDS` and
listed in the dashboard (**Settings → Content still needed**) and on the overview
(**Site readiness**).

---

## 2. Quick start

```bash
npm install
cp .env.example .env.local     # already present in this checkout
npm run dev                    # http://localhost:3000
```

The project runs with **no backend configured**: the public site renders from
typed content files and appointment requests are written to a local demo store
(`.data/`, git-ignored).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (next/core-web-vitals + next/typescript) |
| `npm run check` | Typecheck + lint together |

### Opening the dashboard locally

Without Supabase, the dashboard is **locked by design**. To preview it:

```bash
# .env.local
ADMIN_DEMO_ACCESS="true"
SESSION_SECRET="<any long random string>"
```

Then visit `/admin` → *Open the demo dashboard*. This is a development
convenience with **no real authentication** — never enable it on a deployment
holding real patient data.

---

## 3. Architecture

```
src/
├── app/
│   ├── (public) page.tsx, services, about, gallery, contact, appointment, legal/[slug]
│   ├── admin/                 ← custom dashboard (see §6)
│   │   ├── layout.tsx         ← noindex only
│   │   ├── login/page.tsx     ← public sign-in / setup screen
│   │   └── (dashboard)/       ← protected group: requireStaff() gate
│   ├── api/health/route.ts    ← config/uptime endpoint (no secrets)
│   ├── layout.tsx, globals.css, icon.svg, sitemap.ts, robots.ts, error.tsx, not-found.tsx
├── components/
│   ├── brand/Logo.tsx         ← single place to swap in the final logo
│   ├── layout/                ← SiteHeader, SiteFooter
│   ├── home/ services/ booking/ contact/ admin/ ui/
├── content/                   ← SINGLE SOURCE OF TRUTH for site content
│   ├── site.ts                ← identity, contact, hours, placeholders, navigation
│   ├── services.ts            ← 9 categories, 20 treatments
│   └── sections.ts            ← copy, values, team, FAQ, gallery, reviews
├── lib/
│   ├── booking/               ← pure domain: time zones, slots, references, config
│   ├── services/              ← application layer: availability, appointments, contact, email, readiness
│   ├── queries/               ← read layer (Supabase when configured, else content files)
│   ├── actions/               ← Server Actions: public forms, auth, admin mutations
│   ├── auth/                  ← session, demo cookie, requireStaff()
│   ├── data/                  ← local demo store (no Supabase)
│   ├── supabase/              ← browser / server / admin clients, middleware, types
│   ├── validation/schemas.ts  ← Zod schemas shared by client and server
│   ├── env.ts, rate-limit.ts, utils.ts
│   └── middleware.ts          ← session refresh + cheap admin gate
└── supabase/migrations/       ← 0001 schema → 0004 seed (+ README)
```

**Design rule:** server components render content, `lib/services` owns business
logic, `lib/queries` owns data access, and `content/` is the fallback. Swapping a
content file for a database table never requires touching a component.

---

## 4. Design system

| Token | Value | Notes |
|---|---|---|
| `ink` | `#0A2A2E` → `#061B1E` | Deep teal-black for dark sections, admin sidebar |
| `brand` | `#0F5C55` (50–950 scale) | Primary teal; 7.8:1 on white |
| `gold` | `#C2A06B` | Decorative only — 2.4:1 on white |
| `gold.ink` | `#8A6D3A` | Accessible gold for text (4.85:1 on white) |
| `cream` | `#FAF8F5` | Page canvas |
| Fonts | Cormorant Garamond (display) + Montserrat (UI/body) | Self-hosted via `@fontsource` — no Google Fonts at build or runtime |
| Motion | CSS reveal utilities + `Reveal` component + Framer Motion for interaction | `prefers-reduced-motion` fully respected |

Component classes live in `globals.css` (`btn-primary`, `card`, `field`,
`eyebrow`, `container-x`, `section`). Contrast was checked with WCAG AA in mind;
see the comment block at the top of `tailwind.config.ts`.

**Accessibility:** skip link, semantic landmarks, labelled form controls with
`aria-invalid`/`aria-describedby`, visible focus rings, `aria-live` status
messages, keyboard-operable menus (Escape to close, body scroll lock), and
no-JS-safe reveals (content is never hidden in the SSR HTML).

---

## 5. Appointment system

Not a fake form — a working engine:

1. **Slot generation** (`lib/booking/slots.ts`, pure and unit-testable): opening
   hours + appointment duration + turnaround produce candidate slots; a slot that
   would run past closing time is never offered.
2. **Rules**: minimum notice (`minimumNoticeHours`), booking horizon
   (`horizonDays`), closed days skipped, lead-time/booked/closure reasons.
3. **Blocking data**: existing `pending`/`confirmed` appointments and clinic
   closures. Patients read only the `appointment_slots` / `time_off_slots`
   **views**, which expose time ranges and no patient data.
4. **Server-side authority**: `checkSlotBookable()` re-validates the requested
   slot at submission. The client is never trusted.
5. **Concurrency**: at the database level an *exclusion constraint* rejects
   overlapping blocking appointments, so two simultaneous requests cannot both
   win. The service maps both `23505` and `23P01` to a friendly message.
6. **Notifications**: patient confirmation + clinic notification via Resend
   (`fetch`, no SDK). Best-effort — a mail failure never loses a booking.
7. **Abuse protection**: Zod validation, per-IP rate limiting, honeypot field.

Time zones are handled with `Intl` (no date library): every instant is stored as
UTC, and all wall-clock values are interpreted in
`NEXT_PUBLIC_CLINIC_TIME_ZONE` (default `Africa/Algiers`, currently a
**placeholder to confirm**).

> **Requests vs bookings:** the site is explicit that submitting a request does
> not reserve a slot until the clinic confirms it.

---

## 6. Admin dashboard

Custom-built (the template had none), at `/admin`:

| Page | Contents |
|---|---|
| **Overview** | Today's count, awaiting confirmation, upcoming 7 days, unread messages, today's schedule, next appointments, **Site readiness** report, operational reminders |
| **Appointments** | Filters by status, grouped by clinic-local day, status updates, staff-only internal notes, patient contact links |
| **Messages** | Contact-form inbox, read/unread toggling, subject badges |
| **Settings & setup** | Live environment status, step-by-step Supabase setup, placeholder inventory, security notes |

Details that matter:

- **Two-layer authorisation.** Middleware performs a cheap redirect; the
  protected layout and every Server Action re-check with `requireStaff()` /
  `getStaffOrNull()`. A Server Action is a public endpoint, so the UI is never
  the gate.
- **Revocable instantly.** Authorisation depends on an *active* row in
  `staff_profiles` — not on JWT claims that keep working until they expire.
- **Progressive enhancement.** Status changes and notes post through plain
  `<form>` elements, so the dashboard still works if JavaScript fails.
- **Honest labelling.** Demo mode is banner-flagged, and sample records are
  marked `sample` in the UI.

---

## 7. Supabase integration

See **[`supabase/README.md`](./supabase/README.md)** for the full setup. In short:
create the project → run `supabase/migrations/0001`–`0004` → create a user → add
its `staff_profiles` row → add the env vars. The site then automatically switches
from content files to the database, and from the demo store to real persistence.

| Migration | Contents |
|---|---|
| `0001_schema.sql` | Enums, 7 tables, indexes, constraints |
| `0002_functions.sql` | `is_staff()`/`is_admin()`, updated-at + audit triggers, **double-booking exclusion constraint**, patient-safe views |
| `0003_rls.sql` | RLS on every table + grants (anon: insert-only on appointments/messages) |
| `0004_seed.sql` | Opening hours (⚠️ demo values) + the 20-treatment catalogue |

Server code uses three clients: browser (anon, RLS), server (cookie-bound), and
an optional service-role client that returns `null` unless configured. Secrets
never reach the browser.

---

## 8. Replacing the placeholders

| What | Where |
|---|---|
| **Logo** | `src/components/brand/Logo.tsx` — one component used by the header, footer, sign-in and sidebar. Drop files in `public/brand/` and render an `<Image>` there. |
| Clinic name, tagline, phone, email, address, socials, hours | `src/content/site.ts` |
| Treatments, categories, durations | `src/content/services.ts` |
| Page copy, values, team, FAQ, reviews, gallery | `src/content/sections.ts` |
| Photos | `public/media/` (see its README), then set `image` on the content entry |
| Legal pages | `src/app/legal/[slug]/page.tsx` — placeholder wording, needs review |
| Structured data (address/phone/hours) | `src/app/layout.tsx` — re-add the omitted fields once confirmed |
| Booking policy (notice, horizon, slot step, time zone) | `src/lib/booking/config.ts` |

After adding real content, clear the corresponding entries from
`PLACEHOLDER_FIELDS` — the site readiness panel will reflect it.

---

## 9. Deployment hardening

Before going live:

1. Set `ADMIN_DEMO_ACCESS="false"` and a strong `SESSION_SECRET`.
2. Configure Supabase and email (§7).
3. Add `X-Frame-Options: SAMEORIGIN` (or a CSP `frame-ancestors` directive) at
   the CDN/edge **for the production domain**. It is intentionally omitted from
   `next.config.ts` so the app remains embeddable in preview/host iframes.
4. Review the CSP in `next.config.ts` after adding any third-party script
   (analytics, maps, chat).
5. Enable database backups and set a retention policy for appointments.
6. Point a monitoring service at `/api/health`.
7. Re-run `npm run check` and `npm run build`.

---

## 10. Licensing & attribution

- **Code:** MIT. This project derives from the WhitePearl template
  (© 2025 R.paco, MIT) — the required attribution is in
  [`NOTICE.md`](./NOTICE.md). Keep it in place.
- **Images:** the template shipped 22 stock photographs (Shutterstock, Adobe
  Stock, Canva) — one carried an explicit *"No use without permission"* notice.
  They were **removed** and are no longer part of this repository. Do not
  reintroduce stock imagery without a licence; see `public/media/README.md` for
  the rights and consent rules that apply to clinic and patient photography.
- **Content:** all clinic-facing content in this repository is placeholder copy.
  It makes no medical, outcome or accreditation claims, and contains no invented
  practitioners, credentials or reviews.

---

## 11. Known limitations / next steps

1. **Create the Supabase project** and run the migrations — the biggest single
   step towards production.
2. **Rate limiting is per-instance** (`src/lib/rate-limit.ts`). On serverless
   hosting, move it to Redis/Upstash; the call sites do not change.
3. **The demo store is not a database.** Without Supabase, data lives in
   `.data/*.json`, is not backed up, and is unsuitable for real patients.
4. **No automated tests yet.** The booking engine is pure and easy to test —
   Vitest is the natural next addition, then Playwright for the booking flow.
5. **Email is unverified** (no API key here). Send a live test once
   `RESEND_API_KEY` exists, and add SPF/DKIM for the sender domain.
6. **Content is English-only.** `clinic.languages` already lists French, Arabic
   and English; adding `next-intl` is the recommended path, plus
   `@fontsource/*-arabic` subsets and RTL support.
7. **Reminders** (SMS/WhatsApp, e.g. 24 h before) are not implemented; a
   `pg_cron` job or Edge Function fits the current schema.
8. **Gallery/services management UI** is read-only so far — the dashboard lists
   content readiness, but CRUD screens for services, hours, team and media are
   the next dashboard milestone (the tables and RLS policies are already in
   place).
9. **Residual npm advisories** are limited to the build toolchain (Tailwind v3's
   `chokidar`/`braces`/`micromatch`, ESLint plugins). None ship to the runtime;
   the Next.js critical advisories were resolved by the upgrade to 15.5.27.
