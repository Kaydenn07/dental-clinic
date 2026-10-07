import type { FaqItem, TeamMember, Testimonial, ValueItem } from "@/types/content";

/**
 * ============================================================================
 *  PAGE COPY — DEMO CONTENT
 * ============================================================================
 *  All descriptive copy below is intentional placeholder wording written to
 *  keep the layout readable. It makes no medical, outcome or accreditation
 *  claims. Replace with the clinic's approved copy before launch.
 * ============================================================================
 */

export const heroContent = {
  eyebrow: "Dental care",
  /** The tagline is generic positioning, not a clinical claim. */
  title: "Calm, precise dentistry,",
  titleAccent: "for every stage of your smile",
  subtitle:
    "Dr. Bouamara Dental Clinic — a focused practice built around clear explanations, unhurried appointments and modern equipment.",
  primaryCta: { href: "/appointment", label: "Request an appointment" },
  secondaryCta: { href: "/services", label: "View services" },
};

export const trustPoints: ValueItem[] = [
  {
    id: "trust-time",
    title: "Unhurried appointments",
    description: "Scheduled so there is time to explain findings and agree on a plan before treatment.",
  },
  {
    id: "trust-clarity",
    title: "Written treatment plans",
    description: "Options, phases and estimated costs set out in writing before you decide.",
  },
  {
    id: "trust-hygiene",
    title: "Strict sterilisation protocol",
    description: "Instrument reprocessing and surface protocols followed for every patient.",
  },
  {
    id: "trust-prevention",
    title: "Prevention first",
    description: "Routine reviews and prevention are recommended before more invasive options.",
  },
];

export const values: ValueItem[] = [
  {
    id: "value-honesty",
    title: "Honest advice",
    description:
      "You are told what is needed, what can wait, and what is optional — with the reasoning behind it.",
  },
  {
    id: "value-comfort",
    title: "Comfort as standard",
    description:
      "Anaesthesia, pacing and positioning are adjusted to you, including for anxious patients.",
  },
  {
    id: "value-precision",
    title: "Precision work",
    description: "Treatment planned from imaging and measurement rather than guesswork.",
  },
  {
    id: "value-continuity",
    title: "Continuity of care",
    description: "The same practitioner follows your case from first consultation to review.",
  },
];

/**
 * Practitioner profiles.
 *
 * ⚠️ Only the practice name is known so far. Roles, biographies and
 * qualifications must come from the clinic and be verified before publishing —
 * inventing credentials on a medical site is unacceptable (and in most
 * jurisdictions it is unlawful advertising). Until then each card renders as a
 * clearly-labelled placeholder slot.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "team-owner",
    name: "Dr. Bouamara",
    role: "Dentist — practice owner",
    credentials: null,
    bio: null,
    image: null,
    isPlaceholder: true,
  },
  {
    id: "team-slot-2",
    name: "Team member slot",
    role: "To be confirmed",
    credentials: null,
    bio: null,
    image: null,
    isPlaceholder: true,
  },
  {
    id: "team-slot-3",
    name: "Team member slot",
    role: "To be confirmed",
    credentials: null,
    bio: null,
    image: null,
    isPlaceholder: true,
  },
];

export const aboutContent = {
  eyebrow: "About the practice",
  title: "A practice built around clarity and precision",
  /** Neutral placeholder narrative — rewrite with the clinic's real story. */
  paragraphs: [
    "Dr. Bouamara Dental Clinic is presented here as a focused general dental practice. This introductory paragraph is placeholder copy: replace it with the practice's real history, approach and philosophy.",
    "The sections below are deliberately free of the awards, statistics and accreditation badges that template sites often invent. Add verified details only — they are far more convincing than invented numbers.",
    "Practitioner biographies are left as clearly marked placeholders until Dr. Bouamara supplies the exact wording, qualifications and special interests to publish.",
  ],
  /** Set once the clinic confirms its own wording. */
  isPlaceholder: true,
};

export const facilityContent = {
  eyebrow: "The clinic",
  title: "Equipment and environment",
  body: "A short description of the treatment rooms, sterilisation area and waiting space belongs here, along with real photographs of the practice.",
  isPlaceholder: true,
};

/**
 * Gallery items. `image` stays `null` until the clinic supplies photographs
 * with the right to publish them (and patient consent where applicable).
 */
export const galleryItems = [
  { id: "gal-reception", title: "Reception", caption: "Photo pending", image: null },
  { id: "gal-room-1", title: "Treatment room", caption: "Photo pending", image: null },
  { id: "gal-sterilisation", title: "Sterilisation area", caption: "Photo pending", image: null },
  { id: "gal-equipment", title: "Equipment", caption: "Photo pending", image: null },
  { id: "gal-waiting", title: "Waiting area", caption: "Photo pending", image: null },
  { id: "gal-scan", title: "Digital scanning", caption: "Photo pending", image: null },
] as const;

/**
 * Testimonials are intentionally empty.
 *
 * Publishing patient reviews requires documented consent, and inventing them
 * is both dishonest and, in many jurisdictions, unlawful advertising. The
 * reviews section renders an explanatory empty state until real, consented and
 * approved reviews are added to `approvedTestimonials`.
 */
export const testimonials: Testimonial[] = [];

export const approvedTestimonials = (): Testimonial[] =>
  testimonials.filter((testimonial) => testimonial.approved);

export const faqs: FaqItem[] = [
  {
    id: "faq-book",
    question: "How do I book an appointment?",
    answer:
      "Use the booking form on this site. You choose a service and a time slot, and the request is sent to the clinic for confirmation. You will receive a confirmation once the clinic has reviewed it.",
    isPlaceholder: false,
  },
  {
    id: "faq-first-visit",
    question: "What happens at a first visit?",
    answer:
      "A first appointment usually includes a discussion of your concerns, an examination and any imaging that is clinically indicated. A treatment plan is then explained and given to you in writing.",
    isPlaceholder: false,
  },
  {
    id: "faq-urgent",
    question: "I am in pain — how quickly can I be seen?",
    answer:
      "Placeholder: add the clinic's real procedure for urgent cases, including the phone number to call and the hours it is answered.",
    isPlaceholder: true,
  },
  {
    id: "faq-payment",
    question: "How does payment work?",
    answer:
      "Placeholder: add the accepted payment methods, whether insurance or third-party payment is accepted, and how estimates are issued.",
    isPlaceholder: true,
  },
  {
    id: "faq-cancellation",
    question: "What is the cancellation policy?",
    answer:
      "Placeholder: add the clinic's notice period for cancellations and any associated conditions.",
    isPlaceholder: true,
  },
];

/**
 * Legal pages are required before a public launch but their wording depends on
 * the clinic's jurisdiction and the final data flows.
 */
export const legalPages = [
  { id: "legal-privacy", href: "/legal/privacy", label: "Privacy policy", isPlaceholder: true },
  { id: "legal-terms", href: "/legal/terms", label: "Terms of use", isPlaceholder: true },
  { id: "legal-cookies", href: "/legal/cookies", label: "Cookie notice", isPlaceholder: true },
];

export const bookingNotice = {
  title: "Requests, not instant bookings",
  body: "Submitting the form sends an appointment request. A slot is only reserved once the clinic confirms it — you will always be told the outcome.",
  isPlaceholder: false,
};
