import Link from "next/link";

import { clinic } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Temporary text-based brand mark.
 *
 * ⚠️ REPLACE THIS FILE when the final logo is supplied — every header, footer,
 * auth screen and the admin sidebar render through this component, so nothing
 * else needs to change.
 *
 * To swap in an image:
 *   1. put the file in `public/brand/logo.svg` (plus a light/dark variant),
 *   2. replace the <span> below with next/image (remember `alt` text),
 *   3. keep the `size` prop behaving the same way.
 */

interface LogoProps {
  /** Visual size of the mark. */
  size?: "sm" | "md" | "lg";
  /** `light` for dark backgrounds. */
  tone?: "dark" | "light";
  /** Render as a link to the home page. */
  asLink?: boolean;
  /** Hide the "Dental Clinic" line (used in the admin sidebar). */
  compact?: boolean;
  className?: string;
}

const SIZES = {
  sm: { monogram: "h-9 w-9 text-sm", name: "text-lg", sub: "text-[0.5rem]" },
  md: { monogram: "h-11 w-11 text-base", name: "text-xl", sub: "text-[0.5625rem]" },
  lg: { monogram: "h-14 w-14 text-lg", name: "text-2xl", sub: "text-[0.625rem]" },
} as const;

export function Logo({
  size = "md",
  tone = "dark",
  asLink = true,
  compact = false,
  className,
}: LogoProps) {
  const sizing = SIZES[size];
  const isLight = tone === "light";

  const content = (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl border font-heading font-semibold tracking-wide",
          sizing.monogram,
          isLight
            ? "border-gold/50 bg-white/5 text-gold"
            : "border-gold-ink/30 bg-brand-700/[0.06] text-brand-800",
        )}
      >
        {clinic.monogram}
        <span
          className={cn(
            "absolute -bottom-px left-1/2 h-px w-6 -translate-x-1/2",
            isLight ? "bg-gold/70" : "bg-gold-ink/50",
          )}
        />
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "truncate font-heading tracking-tight",
            sizing.name,
            isLight ? "text-white" : "text-ink-900",
          )}
        >
          {clinic.wordmark}
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-1 font-ui font-semibold uppercase tracking-eyebrow",
              sizing.sub,
              isLight ? "text-gold/90" : "text-gold-ink",
            )}
          >
            Dental Clinic
          </span>
        )}
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      href="/"
      aria-label={`${clinic.name} — home`}
      className="rounded-lg transition-opacity duration-200 hover:opacity-90"
    >
      {content}
    </Link>
  );
}
