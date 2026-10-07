"use server";

import { headers } from "next/headers";

import type { ActionResult, DayAvailability } from "@/lib/booking/types";
import { clientKeyFrom, rateLimit } from "@/lib/rate-limit";
import { createAppointmentRequest } from "@/lib/services/appointments";
import { getUpcomingAvailability } from "@/lib/services/availability";
import { createContactMessage } from "@/lib/services/contact";
import { getServiceById } from "@/lib/queries/site";
import {
  appointmentRequestSchema,
  contactMessageSchema,
  fieldErrorsFrom,
} from "@/lib/validation/schemas";

/**
 * Public form endpoints (Server Actions).
 *
 * Security posture:
 *  - Zod validation runs server-side regardless of client checks.
 *  - Rate limited per IP (see `src/lib/rate-limit.ts`).
 *  - Honeypot field `company`: bots that fill it get a fake success.
 *  - The slot is re-validated against live availability before insert.
 */

export interface AvailabilityResponse {
  ok: boolean;
  /** `false` when the clinic has no opening hours configured yet. */
  configured: boolean;
  timeZone: string;
  serviceTitle: string;
  durationMinutes: number;
  days: DayAvailability[];
  message?: string;
}

/**
 * Availability for the booking wizard.
 *
 * All slot generation happens on the server; the browser only receives the
 * resulting times, so the client cannot fabricate a bookable slot.
 */
export async function fetchAvailabilityAction(
  serviceId: string,
  dayCount = 7,
): Promise<AvailabilityResponse> {
  const service = await getServiceById(serviceId);

  if (!service) {
    return {
      ok: false,
      configured: false,
      timeZone: "",
      serviceTitle: "",
      durationMinutes: 0,
      days: [],
      message: "Please choose a treatment to see available times.",
    };
  }

  const preview = await getUpcomingAvailability(service.durationMinutes, dayCount);

  return {
    ok: true,
    configured: preview.configured,
    timeZone: preview.timeZone,
    serviceTitle: service.title,
    durationMinutes: service.durationMinutes,
    days: preview.days,
    message: preview.configured
      ? undefined
      : "The clinic's opening hours are still being confirmed, so online times are not available yet.",
  };
}

export interface FormState extends ActionResult {
  /** Populated on success so the UI can show a confirmation panel. */
  reference?: string;
  whenLabel?: string;
  serviceTitle?: string;
  emailsSent?: boolean;
  retryAfterSeconds?: number;
}

export const initialFormState: FormState = { ok: false, message: "" };

export async function submitAppointmentRequest(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const requestHeaders = await headers();

  const limit = rateLimit(clientKeyFrom(requestHeaders, "booking"), {
    limit: 5,
    windowSeconds: 600,
  });

  if (!limit.ok) {
    return {
      ok: false,
      message: `Too many requests. Please try again in ${Math.ceil(
        limit.retryAfterSeconds / 60,
      )} minute(s), or contact the clinic directly.`,
      retryAfterSeconds: limit.retryAfterSeconds,
    };
  }

  const raw = {
    serviceId: String(formData.get("serviceId") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    patientName: String(formData.get("patientName") ?? ""),
    patientEmail: String(formData.get("patientEmail") ?? ""),
    patientPhone: String(formData.get("patientPhone") ?? ""),
    isNewPatient: String(formData.get("isNewPatient") ?? "yes") === "yes",
    notes: String(formData.get("notes") ?? ""),
    company: String(formData.get("company") ?? ""),
  };

  const parsed = appointmentRequestSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  // Honeypot tripped — behave exactly like a success so bots do not retry.
  if (parsed.data.company && parsed.data.company.length > 0) {
    return {
      ok: true,
      message: "Request received.",
      reference: "DB-PENDING",
    };
  }

  return createAppointmentRequest({
    serviceId: parsed.data.serviceId,
    date: parsed.data.date,
    time: parsed.data.time,
    patientName: parsed.data.patientName,
    patientEmail: parsed.data.patientEmail,
    patientPhone: parsed.data.patientPhone,
    isNewPatient: parsed.data.isNewPatient,
    notes: parsed.data.notes,
  });
}

export async function submitContactMessage(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const requestHeaders = await headers();

  const limit = rateLimit(clientKeyFrom(requestHeaders, "contact"), {
    limit: 5,
    windowSeconds: 600,
  });

  if (!limit.ok) {
    return {
      ok: false,
      message: "Too many messages sent. Please try again later.",
      retryAfterSeconds: limit.retryAfterSeconds,
    };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""),
  };

  const parsed = contactMessageSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  if (parsed.data.company && parsed.data.company.length > 0) {
    return { ok: true, message: "Message received." };
  }

  return createContactMessage({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
}
