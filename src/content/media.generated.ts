/**
 * ============================================================================
 *  MEDIA MANIFEST — the files that `npm run media:setup` produced
 * ============================================================================
 *  `scripts/media-setup.mjs` writes processed images into `public/media/…` and
 *  prints a ready-to-paste snippet for this file (it does not rewrite it, so
 *  hand-edited entries are never lost). Paste the snippet below, or point an
 *  entry at any other URL — `src/content/media.ts` reads everything from here.
 *
 *  Every value is `null`/empty until a real file exists, which is what makes
 *  the site fall back to a labelled placeholder instead of a broken image.
 *  Commit this file so every environment renders identically.
 * ============================================================================
 */

export interface GeneratedMedia {
  /** Portrait of Dr. Messaouda Bouamara for the About page. */
  doctorPortrait: string | null;
  /** Studio still from the television appearance. */
  appearanceStill: string | null;
  /** Before/after case sheets, in display order. */
  results: { id: string; composite: string }[];
  /**
   * Clinic interior photographs, in display order.
   *
   * `illustrative: true` marks a picture that is *not* a photograph of this
   * practice — the site labels it as such. Replace it by dropping real files
   * into `media-source/facility/`, running `npm run media:setup`, and pasting
   * the snippet the script prints (which sets `illustrative: false`).
   */
  facility: { id: string; src: string; illustrative?: boolean }[];
}

export const generatedMedia: GeneratedMedia = {
  doctorPortrait: null,
  appearanceStill: null,
  results: [],
  facility: [
    // Illustrative interiors, supplied while the clinic's own photographs are
    // still being taken. They are labelled "Illustrative view" on the site.
    { id: "gal-reception", src: "/media/facility/reception.jpg", illustrative: true },
    { id: "gal-room-1", src: "/media/facility/treatment-room.jpg", illustrative: true },
    { id: "gal-sterilisation", src: "/media/facility/sterilisation.jpg", illustrative: true },
    { id: "gal-waiting", src: "/media/facility/waiting-area.jpg", illustrative: true },
  ],
};
