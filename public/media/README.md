# Clinic media

Every image on the site is referenced from **`src/content/media.ts`**. Nothing is
hard-coded in a component, so a photo can be added, swapped or removed by
editing one line.

Until a path is set, `MediaPlaceholder` renders a branded frame instead of a
broken image — which is why the site looks complete today.

## Suggested layout

```
public/media/
  doctor/        dr-bouamara.jpg            portrait for the About section
  facility/      reception.jpg, treatment-room.jpg, sterilisation.jpg,
                 equipment.jpg, waiting-area.jpg, scanning.jpg
  results/       case-01-before.jpg, case-01-after.jpg, …  (before / after)
  appearances/   nabd-el-seha.jpg           still from the TV appearance
```

## How to attach a photo

1. Save the file in the matching folder above (JPEG, ideally 1600–2400 px on the
   long edge, sRGB).
2. Set the path in `src/content/media.ts`, e.g.

   ```ts
   facility[0].src = "/media/facility/reception.jpg";   // or edit the array
   results[0].before = "/media/results/case-01-before.jpg";
   ```

3. That is all — Next.js optimises resizing/format per request, and the alt text
   and aspect ratio come from the same entry.

For a remote file (e.g. Supabase Storage), paste the full URL and add the host to
`images.remotePatterns` in `next.config.ts`.

## Consent and rights — read before publishing

- **Clinic photography:** only publish images the clinic owns or has licensed,
  and keep the licence receipts.
- **Patient photography (before/after):** requires documented, specific consent
  for publication. Each case in `src/content/media.ts` carries a
  `consentOnFile` flag — the gallery renders **only** cases where it is `true`,
  together with a standing disclaimer. Set it to `false` and the case
  disappears from the site immediately. Never include identifying details.
- **Doctor's portrait:** publish a photograph of Dr. Bouamara as supplied. Do not
  retouch her appearance or generate/synthesise facial details; crop only, and
  keep `position` in the media entry if the framing needs adjusting.
- **Stock imagery:** none is bundled. The template this project started from
  shipped Shutterstock/Adobe Stock files carrying "No use without permission"
  notices, and they were removed for that reason. Do not reintroduce stock
  photography — especially not as a stand-in for real staff or patients.
