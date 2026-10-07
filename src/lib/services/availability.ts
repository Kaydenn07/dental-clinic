import "server-only";

import { bookingConfig } from "@/lib/booking/config";
import { addDays, addMinutes, dateKeyInTimeZone, zonedWallClockToUtc } from "@/lib/booking/time";
import {
  generateDayAvailability,
  isScheduleConfigured,
  isSlotBookable,
  nextOpenDates,
} from "@/lib/booking/slots";
import type { BusyInterval } from "@/lib/booking/slots";
import type { DayAvailability } from "@/lib/booking/types";
import { listDemoBusyIntervals } from "@/lib/data/appointments";
import { isSupabaseConfigured } from "@/lib/env";
import { getOpeningHours } from "@/lib/queries/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Availability engine (server side).
 *
 * Collects the clinic's opening hours plus every blocking interval, then runs
 * the pure slot generator. Works identically with Supabase or the demo store.
 */

interface BlockingRow {
  starts_at: string;
  ends_at: string;
}

/** [start, end) UTC bounds for a clinic-time calendar day. */
export function dayBoundsUtc(dateKey: string): { startIso: string; endIso: string } {
  const start = zonedWallClockToUtc(dateKey, "00:00", bookingConfig.timeZone);
  const end = zonedWallClockToUtc(dateKey, "00:00", bookingConfig.timeZone);
  const nextDay = addDays(end, 1);
  return { startIso: start.toISOString(), endIso: nextDay.toISOString() };
}

async function fetchBusyIntervals(dateKey: string): Promise<BusyInterval[]> {
  const { startIso, endIso } = dayBoundsUtc(dateKey);

  if (!isSupabaseConfigured) {
    const demo = await listDemoBusyIntervals();
    return demo.filter(
      (interval) => interval.startsAt < endIso && interval.endsAt > startIso,
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Reads the patient-safe VIEWS, not the tables: anon can see which time
    // ranges are taken but never any patient detail
    // (see supabase/migrations/0002_functions.sql + 0003_rls.sql).
    const [appointments, timeOff] = await Promise.all([
      supabase
        .from("appointment_slots")
        .select("starts_at, ends_at")
        .lt("starts_at", endIso)
        .gt("ends_at", startIso),
      supabase
        .from("time_off_slots")
        .select("starts_at, ends_at")
        .lt("starts_at", endIso)
        .gt("ends_at", startIso),
    ]);

    const rows: BlockingRow[] = [
      ...((appointments.data ?? []) as BlockingRow[]),
      ...((timeOff.data ?? []) as BlockingRow[]),
    ];

    return rows.map((row) => ({ startsAt: row.starts_at, endsAt: row.ends_at }));
  } catch {
    // Never block the patient if the backend hiccups: fall back to opening hours
    // only, and the request is still reviewed manually by the clinic.
    return [];
  }
}

export async function getDayAvailability(
  dateKey: string,
  durationMinutes: number = bookingConfig.defaultDurationMinutes,
): Promise<DayAvailability> {
  const hours = await getOpeningHours();
  const busy = await fetchBusyIntervals(dateKey);

  return generateDayAvailability({
    date: dateKey,
    hours,
    durationMinutes,
    busy,
  });
}

/**
 * Server-side authoritative slot check, used right before writing an
 * appointment. Reads live hours + blocking intervals, then delegates to the
 * pure rule engine.
 */
export async function checkSlotBookable(
  dateKey: string,
  time: string,
  durationMinutes: number,
): Promise<{ ok: boolean; reason?: string; startsAt?: string; endsAt?: string }> {
  const hours = await getOpeningHours();
  const busy = await fetchBusyIntervals(dateKey);

  return isSlotBookable({
    date: dateKey,
    hours,
    durationMinutes,
    requestedTime: time,
    busy,
  });
}

export interface AvailabilityPreview {
  /** `true` once the clinic's real opening hours are configured. */
  configured: boolean;
  days: DayAvailability[];
  timeZone: string;
}

/** Availability for the booking wizard (a handful of upcoming open days). */
export async function getUpcomingAvailability(
  durationMinutes: number,
  dayCount = 7,
  fromDateKey?: string,
): Promise<AvailabilityPreview> {
  const hours = await getOpeningHours();

  if (!isScheduleConfigured(hours)) {
    return {
      configured: false,
      days: [],
      timeZone: bookingConfig.timeZone,
    };
  }

  const todayKey = fromDateKey ?? dateKeyInTimeZone(new Date(), bookingConfig.timeZone);
  const dates = nextOpenDates(todayKey, dayCount, hours);

  const days = await Promise.all(
    dates.map((date) => getDayAvailability(date, durationMinutes)),
  );

  return { configured: true, days, timeZone: bookingConfig.timeZone };
}

/** Bookable dates within the configured horizon, for the date picker. */
export function bookingHorizon(): string[] {
  const todayKey = dateKeyInTimeZone(new Date(), bookingConfig.timeZone);
  const start = zonedWallClockToUtc(todayKey, "12:00", bookingConfig.timeZone);
  const dates: string[] = [];
  for (let offset = 0; offset < bookingConfig.horizonDays; offset += 1) {
    dates.push(dateKeyInTimeZone(addDays(start, offset), bookingConfig.timeZone));
  }
  return dates;
}

export { addMinutes };
