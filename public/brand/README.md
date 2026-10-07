# Brand assets

Drop the clinic's real logo files in this folder, for example:

- `logo.svg` — primary mark, dark backgrounds
- `logo-dark.svg` — variant for light backgrounds
- `favicon.ico` — 32×32 fallback

Then edit `src/components/brand/Logo.tsx` to render the image instead of the
temporary text wordmark. Every header, footer, sign-in screen and the admin
sidebar use that single component, so the change applies everywhere at once.

Clinic photography goes in `public/media/` (see `public/media/README.md`).
