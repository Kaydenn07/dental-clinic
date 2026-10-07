import { generatedMedia } from "@/content/media.generated";

/**
 * ============================================================================
 *  MEDIA REGISTRY — every image path in the project lives here
 * ============================================================================
 *  Nothing in the components hard-codes an image URL. To swap a photo:
 *
 *    1. drop the file in `public/media/…` (or paste a Supabase Storage URL),
 *    2. point the matching entry below at it,
 *    3. save — every place that shows that image updates at once.
 *
 *  A `null` value renders the branded placeholder instead of a broken image,
 *  which is why the site is complete today and photographs can arrive later.
 * ============================================================================
 */

export interface BrandAssets {
  /** Full lockup for light backgrounds: navy wordmark + gold curve (PNG/SVG). */
  logoLight: string | null;
  /** Full lockup for navy backgrounds: white wordmark + gold curve. */
  logoDark: string | null;
  /** Square icon-only mark — sidebar, favicon fallback, small spaces. */
  markLight: string | null;
  markDark: string | null;
}

export interface PortraitAsset {
  src: string | null;
  alt: string;
  /** `object-position` hint so faces are not cropped awkwardly. */
  position?: string;
}

export interface FacilityPhoto {
  id: string;
  title: string;
  caption: string;
  src: string | null;
  /**
   * `true` when the picture is a stand-in rather than a photograph of this
   * practice. The UI says so; never set it to `false` for imagery the clinic
   * did not send.
   */
  illustrative: boolean;
}

export interface ResultCase {
  id: string;
  /** Neutral label — no clinical claims are made about the treatment. */
  title: string;
  caption: string;
  /** Separate files when available… */
  before: string | null;
  after: string | null;
  /** …or a single ready-made side-by-side composite. */
  composite: string | null;
  /**
   * Explicit consent record. The clinic confirmed that documented patient
   * consent exists for the cases supplied; keep this `true` only while that
   * remains true.
   */
  consentOnFile: boolean;
}

/**
 * ── Brand ───────────────────────────────────────────────────────────────────
 * The clinic supplied a logo sheet. Save the variants it contains here:
 *   public/brand/logo-light.png   navy wordmark + gold (transparent background)
 *   public/brand/logo-dark.png    white wordmark + gold (transparent)
 *   public/brand/mark-light.png   icon only, navy + gold
 *   public/brand/mark-dark.png    icon only, white + gold
 * Then uncomment the four lines below — no component changes are needed.
 */
export const brand: BrandAssets = {
  logoLight: null,
  logoDark: null,
  markLight: null,
  markDark: null,
};

export const logoSizing = {
  /** Rendered height of the full lockup, in pixels, per size token. */
  height: { sm: 34, md: 42, lg: 56 },
} as const;

/**
 * ── Dr. Bouamara ────────────────────────────────────────────────────────────
 * A portrait of the doctor is used in the About section.
 * Save the file as `public/media/doctor/dr-bouamara.jpg`, then set `src` below.
 * Crop for a 4:5 portrait, keep it untouched — do not retouch facial features.
 */
export const doctor: {
  portrait: PortraitAsset;
  /** Optional wider/treatment-room shot used beside the portrait. */
  secondary: PortraitAsset;
} = {
  portrait: {
    // Produced by `npm run media:setup` from the clinic's own photograph.
    src: generatedMedia.doctorPortrait,
    alt: "Dr. Messaouda Bouamara",
    position: "50% 18%",
  },
  secondary: {
    src: null,
    alt: "Dr. Messaouda Bouamara at the clinic",
    position: "50% 40%",
  },
};

/**
 * ── Facility gallery ────────────────────────────────────────────────────────
 * Suggested files: public/media/facility/reception.jpg, treatment-room.jpg,
 * sterilisation.jpg, equipment.jpg, waiting-area.jpg, scanning.jpg
 */
const FACILITY_SLOTS: { id: string; title: string }[] = [
  { id: "gal-reception", title: "Reception" },
  { id: "gal-room-1", title: "Treatment room" },
  { id: "gal-sterilisation", title: "Sterilisation area" },
  { id: "gal-equipment", title: "Equipment" },
  { id: "gal-waiting", title: "Waiting area" },
  { id: "gal-scan", title: "Digital scanning" },
];

export const facility: FacilityPhoto[] = FACILITY_SLOTS.map((slot) => {
  const photo = generatedMedia.facility.find((item) => item.id === slot.id);
  const illustrative = photo?.illustrative ?? false;

  return {
    ...slot,
    src: photo?.src ?? null,
    illustrative,
    caption: !photo
      ? "Photo pending"
      : illustrative
        ? "Illustrative view — a real photograph is on its way."
        : "Photographed at the clinic.",
  };
});

/**
 * ── Treatment results ───────────────────────────────────────────────────────
 * Before/after cases. The clinic confirmed documented patient consent for the
 * material supplied, so these may be published.
 *
 * Each case can be a pair (`before` + `after`) or one pre-made composite.
 * Suggested files: public/media/results/case-01-before.jpg, case-01-after.jpg …
 *
 * Captions stay neutral on purpose: no treatment counts, durations or outcome
 * claims are stated, because none were provided.
 */
const RESULT_CAPTIONS: Record<string, string> = {
  "case-01": "Extra-oral view with a wide smile, before and after.",
  "case-02": "Smile view, before and after.",
  "case-03": "Frontal view, before and after.",
  "case-04": "Lateral view, before and after.",
};

/**
 * Each case is the clinic's own before/after sheet (a composite), because that
 * is how the material was supplied. `before`/`after` stay available for the
 * day separate files exist.
 */
export const results: ResultCase[] = generatedMedia.results.map((item, index) => ({
  id: item.id,
  title: `Case ${String(index + 1).padStart(2, "0")}`,
  caption: RESULT_CAPTIONS[item.id] ?? "Before and after.",
  before: null,
  after: null,
  composite: item.composite,
  consentOnFile: true,
}));

/** Standard, honest disclaimer required next to clinical photography. */
export const resultsDisclaimer =
  "Published with the patient's written consent. Every case is individual and results vary from person to person.";

/**
 * ── Media appearance ────────────────────────────────────────────────────────
 * Optional still from the television appearance.
 * Suggested file: public/media/appearances/nabd-el-seha.jpg
 */
export const appearanceThumbnail: string | null = generatedMedia.appearanceStill;

/** `true` when at least one real photograph is wired up. */
export const hasAnyMedia = (): boolean =>
  Boolean(brand.logoLight || doctor.portrait.src || facility.some((photo) => photo.src));
