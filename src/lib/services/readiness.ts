import "server-only";

import { clinic, PLACEHOLDER_FIELDS, scheduleConfirmed } from "@/content/site";
import { services } from "@/content/services";
import { emailEnv, isEmailConfigured, isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";

/**
 * "Site readiness" report shown on the admin overview.
 *
 * It answers one question honestly: what still has to be filled in before this
 * site can go public? Everything comes from real configuration state — nothing
 * here is decorative.
 */

export type ReadinessState = "done" | "pending" | "blocked";

export interface ReadinessItem {
  id: string;
  label: string;
  detail: string;
  state: ReadinessState;
  /** Where the operator fixes it. */
  action?: { label: string; href?: string };
}

export interface ReadinessReport {
  items: ReadinessItem[];
  completed: number;
  total: number;
  percent: number;
  placeholderFields: readonly string[];
}

export async function getReadinessReport(): Promise<ReadinessReport> {
  const imagesPending = services.every((service) => service.image === null);
  const phonePending = clinic.contact.phone.length === 0;
  const emailPending = clinic.contact.email.endsWith("example.com");
  const addressPending = clinic.contact.addressLine.toLowerCase().includes("to be confirmed");

  const items: ReadinessItem[] = [
    {
      id: "supabase",
      label: "Supabase project connected",
      detail: isSupabaseConfigured
        ? "Database and auth environment variables are present."
        : "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run the SQL migrations.",
      state: isSupabaseConfigured ? "done" : "pending",
      action: { label: "Setup guide", href: "/admin/settings" },
    },
    {
      id: "service-role",
      label: "Privileged server key configured",
      detail: isSupabaseAdminConfigured
        ? "SUPABASE_SERVICE_ROLE_KEY is set (server-only)."
        : "Optional: required for background jobs and staff provisioning.",
      state: isSupabaseAdminConfigured ? "done" : "pending",
    },
    {
      id: "email",
      label: "Confirmation emails",
      detail: isEmailConfigured
        ? `Outbound email configured (${emailEnv.from}).`
        : "Without RESEND_API_KEY + EMAIL_FROM, confirmations are logged instead of sent.",
      state: isEmailConfigured ? "done" : "pending",
    },
    {
      id: "hours",
      label: "Opening hours confirmed",
      detail: scheduleConfirmed
        ? "The clinic's real opening hours are in use."
        : "A demo schedule is in use and is labelled as such across the site.",
      state: scheduleConfirmed ? "done" : "pending",
      action: { label: "Opening hours" },
    },
    {
      id: "contact",
      label: "Real contact details published",
      detail:
        phonePending || emailPending || addressPending
          ? "Phone, email and/or address are still placeholders."
          : "Contact details are set.",
      state: phonePending || emailPending || addressPending ? "pending" : "done",
    },
    {
      id: "media",
      label: "Clinic photography added",
      detail: imagesPending
        ? "No service photos yet — branded placeholders are being rendered instead."
        : "Service images are in place.",
      state: imagesPending ? "pending" : "done",
      action: { label: "Gallery" },
    },
    {
      id: "team",
      label: "Practitioner profiles approved",
      detail:
        "Biographies and credentials must be supplied and approved by the clinic before publishing.",
      state: "pending",
    },
    {
      id: "legal",
      label: "Legal pages published",
      detail: "Privacy policy, terms and cookie notice still need the clinic's approved wording.",
      state: "pending",
    },
    {
      id: "reviews",
      label: "Patient reviews (consented)",
      detail: "No reviews are published. Add only reviews with documented patient consent.",
      state: "pending",
    },
  ];

  const completed = items.filter((item) => item.state === "done").length;

  return {
    items,
    completed,
    total: items.length,
    percent: Math.round((completed / items.length) * 100),
    placeholderFields: PLACEHOLDER_FIELDS,
  };
}
