import type { OpeningHours } from "@/types/content";

/**
 * ============================================================================
 *  CLINIC IDENTITY & CONTACT
 * ============================================================================
 *  ⚠️  PLACEHOLDER CONTENT — nothing in this file has been provided by the
 *  clinic yet. Values are deliberately generic or use the reserved `example.com`
 *  domain so that nothing here can be mistaken for real clinic information.
 *
 *  To go live, replace every field listed in `PLACEHOLDER_FIELDS` below and
 *  delete it from that list. The UI renders a "demo content" marker for any
 *  field still listed, so it is impossible to ship a placeholder by accident.
 * ============================================================================
 */

export const clinic = {
  /** Display name used in copy and metadata. */
  name: "Dr. Bouamara Dental Clinic",
  /** Short form for the header, footer and admin sidebar. */
  shortName: "Dr. Bouamara",
  /** Text used by the temporary <Logo /> wordmark. */
  wordmark: "Dr. Bouamara",
  /** Temporary text mark. See `src/components/brand/Logo.tsx` — the final logo
   *  only needs to be dropped in there and it updates everywhere. */
  monogram: "DB",
  tagline: "Precision dentistry, delivered calmly.",

  contact: {
    /** International format, digits and spaces only, e.g. "+213 000 000 000". */
    phone: "+00 000 000 000",
    phoneDisplay: "+00 000 000 000",
    /** Reserved domain — guaranteed not to be a real mailbox. */
    email: "contact@example.com",
    /** E.164 without "+", e.g. "213000000000". */
    whatsapp: null as string | null,
    addressLine: "Address to be confirmed",
    city: null as string | null,
    country: "Algeria",
    /** Google Maps embed URL (`https://www.google.com/maps/embed?...`). */
    mapEmbedUrl: null as string | null,
    /** Public "open in maps" link. */
    mapLinkUrl: null as string | null,
  },

  /** Social profiles — `null` hides the icon entirely. */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
  },

  /** Languages the clinic communicates in — update once confirmed. */
  languages: ["Français", "العربية", "English"],

  /** Shown wherever the demo opening hours appear. */
  scheduleNotice:
    "Demo schedule — the clinic's real opening hours still need to be confirmed.",

  /** Year the practice was founded — unknown, so no "since" claims are made. */
  foundedYear: null as number | null,

  brand: {
    /** Colour tokens are defined in `tailwind.config.ts`. */
    primary: "#0F5C55",
    accent: "#C2A06B",
  },
} as const;

/**
 * Opening hours.
 *
 * ⚠️ DEMO SCHEDULE — these times are NOT the clinic's real hours. They exist so
 * the appointment engine can be exercised end to end (real slot generation,
 * conflict detection, closed-day handling). While `scheduleConfirmed` is
 * `false`, every page that shows these times renders a visible
 * "demo schedule" marker, and the admin dashboard lists it as outstanding.
 *
 * To go live: set the real hours here (or manage them from
 * Admin → Opening hours, which writes to the `opening_hours` table) and flip
 * `scheduleConfirmed` to `true`.
 */
export const scheduleConfirmed = false;

export const openingHours: OpeningHours[] = [
  { weekday: 0, label: "Sunday", open: "09:00", close: "17:00", closed: false },
  { weekday: 1, label: "Monday", open: "09:00", close: "17:00", closed: false },
  { weekday: 2, label: "Tuesday", open: "09:00", close: "17:00", closed: false },
  { weekday: 3, label: "Wednesday", open: "09:00", close: "17:00", closed: false },
  { weekday: 4, label: "Thursday", open: "09:00", close: "17:00", closed: false },
  { weekday: 5, label: "Friday", open: null, close: null, closed: true },
  { weekday: 6, label: "Saturday", open: "09:00", close: "13:00", closed: false },
];

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Machine-readable list of every field that still holds placeholder data.
 * Surfaced in the admin dashboard ("Site readiness" panel) and checked by
 * `src/lib/content-status.ts`.
 */
export const PLACEHOLDER_FIELDS = [
  "clinic.contact.phone",
  "clinic.contact.email",
  "clinic.contact.addressLine",
  "clinic.contact.city",
  "clinic.contact.mapEmbedUrl",
  "clinic.social",
  "openingHours",
  "team",
  "testimonials",
  "gallery",
  "services.images",
  "legal.policyPages",
] as const;

export type PlaceholderField = (typeof PLACEHOLDER_FIELDS)[number];
