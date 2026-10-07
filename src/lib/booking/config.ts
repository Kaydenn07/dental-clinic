import { readEnv } from "@/lib/booking/env-reader";

/**
 * Booking engine configuration.
 *
 * ⚠️ PLACEHOLDER VALUES — these are working defaults, not the clinic's real
 * policy. Confirm each one (and the clinic's time zone) before launch.
 */
export const bookingConfig = {
  /** Clinic time zone. Confirm with the clinic — defaults to Algeria time. */
  timeZone: readEnv("NEXT_PUBLIC_CLINIC_TIME_ZONE") ?? "Africa/Algiers",
  /** Granularity of generated slots. */
  slotStepMinutes: 30,
  /** How far ahead patients may request an appointment. */
  horizonDays: 60,
  /** Minimum notice before the earliest bookable slot. */
  minimumNoticeHours: 4,
  /** Used when a service has no duration configured. */
  defaultDurationMinutes: 30,
  /** Buffer added after each appointment before the next slot is offered. */
  turnaroundMinutes: 10,
} as const;

export const BOOKING_TIME_ZONE_IS_PLACEHOLDER = !readEnv("NEXT_PUBLIC_CLINIC_TIME_ZONE");
