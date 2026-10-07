/**
 * ============================================================================
 *  MEDIA MANIFEST — the files that `npm run media:setup` produced
 * ============================================================================
 *  `scripts/media-setup.mjs` writes processed images into `public/media/…` (and
 *  the brand artwork into `public/brand/`), then prints a ready-to-paste
 *  snippet for this file. It never rewrites the file itself, so hand-edited
 *  entries are never lost — paste the snippet, or point an entry at any URL.
 *  `src/content/media.ts` reads everything from here.
 *
 *  Every value is `null`/empty until a real file exists, which is what makes
 *  the site fall back to a labelled placeholder instead of a broken image.
 *  Commit this file so every environment renders identically.
 * ============================================================================
 */

export interface GeneratedMedia {
  /** The clinic's own artwork, extracted from the logo sheet it supplied. */
  brand: {
    logoLight: string | null;
    logoDark: string | null;
    markLight: string | null;
    markDark: string | null;
  } | null;
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
  brand: {
    logoLight: "/brand/logo-light.png",
    logoDark: "/brand/logo-dark.png",
    markLight: "/brand/mark-light.png",
    markDark: "/brand/mark-dark.png",
  },

  doctorPortrait: "/media/doctor/dr-bouamara.jpg",

  appearanceStill: null,

  /**
   * The clinic's own before/after sheets. The printed promotional band (and,
   * on one sheet, the design tool's template footer) is cropped away; case-06
   * is printed after/before and is swapped so it reads before → after.
   */
  results: [
    { id: "case-01", composite: "/media/results/case-01.jpg" },
    { id: "case-02", composite: "/media/results/case-02.jpg" },
    { id: "case-03", composite: "/media/results/case-03.jpg" },
    { id: "case-04", composite: "/media/results/case-04.jpg" },
    { id: "case-05", composite: "/media/results/case-05.jpg" },
    { id: "case-06", composite: "/media/results/case-06.jpg" },
  ],

  facility: [
    // Illustrative interiors, supplied while the clinic's own photographs are
    // still being taken. They are labelled "Illustrative view" on the site.
    { id: "gal-reception", src: "/media/facility/reception.jpg", illustrative: true },
    { id: "gal-room-1", src: "/media/facility/treatment-room.jpg", illustrative: true },
    { id: "gal-sterilisation", src: "/media/facility/sterilisation.jpg", illustrative: true },
    { id: "gal-waiting", src: "/media/facility/waiting-area.jpg", illustrative: true },
  ],
};
