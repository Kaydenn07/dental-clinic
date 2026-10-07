import "server-only";

import { openingHours as contentHours, PLACEHOLDER_FIELDS } from "@/content/site";
import { services as contentServices } from "@/content/services";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OpeningHours, Service, ServiceCategoryId } from "@/types/content";

/**
 * Read layer for public site content.
 *
 * Pattern used across the app: query Supabase when it is configured and the
 * table has rows, otherwise fall back to the typed content files. That means
 * the site is complete today and switches to database-driven content the moment
 * the dashboard starts managing it — with no changes in the components.
 */

function normaliseTime(value: string | null): string | null {
  if (!value) return null;
  // Postgres `time` arrives as "09:00:00".
  return value.slice(0, 5);
}

export async function getOpeningHours(): Promise<OpeningHours[]> {
  if (!isSupabaseConfigured) return contentHours;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("opening_hours")
      .select("weekday, label, opens_at, closes_at, closed")
      .order("weekday", { ascending: true });

    if (error || !data || data.length === 0) return contentHours;

    return data.map((row) => ({
      weekday: row.weekday,
      label: row.label,
      open: normaliseTime(row.opens_at),
      close: normaliseTime(row.closes_at),
      closed: row.closed,
    }));
  } catch {
    return contentHours;
  }
}

function rowToService(row: {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  details: string[] | null;
  duration_minutes: number | null;
  image_url: string | null;
  featured: boolean | null;
  active: boolean | null;
}): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    category: (row.category ?? "preventive") as ServiceCategoryId,
    details: row.details ?? [],
    durationMinutes: row.duration_minutes ?? 30,
    image: row.image_url,
    featured: Boolean(row.featured),
    active: row.active ?? true,
  };
}

export async function getPublicServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) return contentServices.filter((service) => service.active);

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("services")
      .select(
        "id, slug, title, summary, category, details, duration_minutes, image_url, featured, active",
      )
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return contentServices.filter((service) => service.active);
    }

    return data.map(rowToService);
  } catch {
    return contentServices.filter((service) => service.active);
  }
}

export async function getFeaturedServices(limit = 3): Promise<Service[]> {
  const all = await getPublicServices();
  const featured = all.filter((service) => service.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const all = await getPublicServices();
  return all.find((service) => service.id === id);
}

/** Which placeholder fields are still pending — powers the readiness panel. */
export function getPlaceholderFields(): readonly string[] {
  return PLACEHOLDER_FIELDS;
}
