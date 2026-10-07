# Clinic media

Clinic photographs live here so they can be swapped without touching code.

Suggested layout:

```
public/media/
  services/    one photo per treatment (referenced by Service.image)
  gallery/     reception, treatment rooms, equipment, waiting area
  team/        practitioner portraits (see consent note)
```

## How to attach a photo

1. Put the file here, e.g. `public/media/services/whitening.jpg`.
2. Point the content entry at it:
   - `src/content/services.ts` → `image: "/media/services/whitening.jpg"`
   - or, once the dashboard manages content, paste the Supabase Storage URL.

Images are rendered through `MediaPlaceholder`, which already handles sizing,
lazy loading and alt text. Until an image is set, a branded placeholder is shown
instead of a broken image.

## Rights and consent

Only publish images the clinic owns or has licensed, and keep the licence
receipts. Patient photographs (including before/after) additionally require
documented, specific consent, and must never include identifying details.

No stock or scraped imagery is bundled with this project: the template this
project started from shipped Shutterstock/Adobe Stock files carrying
"No use without permission" notices, and they were removed for that reason.
