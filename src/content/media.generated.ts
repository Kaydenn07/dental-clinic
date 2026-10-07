/**
 * ============================================================================
 *  GENERATED FILE — do not edit by hand
 * ============================================================================
 *  Written by `npm run media:setup` (scripts/media-setup.mjs) after it has
 *  processed the clinic's original photographs into `public/media/…`.
 *
 *  Every value is `null`/empty until a real file exists, which is what makes
 *  the site fall back to a labelled placeholder instead of a broken image.
 *  Commit the regenerated version so every environment renders identically.
 *
 *  If you prefer to wire a photo by hand, edit the paths below directly — the
 *  rest of the site reads them through `src/content/media.ts`.
 * ============================================================================
 */

export interface GeneratedMedia {
  /** Portrait of Dr. Messaouda Bouamara for the About page. */
  doctorPortrait: string | null;
  /** Studio still from the television appearance. */
  appearanceStill: string | null;
  /** Before/after case sheets, in display order. */
  results: { id: string; composite: string }[];
  /** Clinic interior photographs, in display order. */
  facility: { id: string; src: string }[];
}

export const generatedMedia: GeneratedMedia = {
  doctorPortrait: null,
  appearanceStill: null,
  results: [],
  facility: [],
};
