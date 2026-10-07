import type { Config } from "tailwindcss";

/**
 * Design system — Dr. Bouamara Dental Clinic
 * ------------------------------------------
 * Identity: deep "clinical teal" + champagne gold on a warm cream canvas.
 * This is intentionally different from the WhitePearl black/white/gold
 * template the project started from.
 *
 * Token rules that keep the palette accessible:
 *  - `gold.DEFAULT` (#C2A06B) is DECORATIVE ONLY (borders, icons, fills on dark).
 *    On white it only reaches 2.4:1 contrast.
 *  - `gold.ink` (#8A6D3A) is the accessible gold for TEXT on light backgrounds (4.85:1).
 *  - `brand.*` teals are safe for text on light backgrounds (7.8:1).
 */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /** Deep teal-black used for dark sections, footer, admin sidebar. */
        ink: {
          DEFAULT: "#0A2A2E",
          50: "#F1F6F6",
          100: "#DCE9E8",
          200: "#B7D2D0",
          300: "#8FB6B3",
          400: "#5E8F8B",
          500: "#3B726D",
          600: "#275A56",
          700: "#164744",
          800: "#0F3634",
          900: "#0A2A2E",
          950: "#061B1E",
        },
        /** Primary brand teal. */
        brand: {
          DEFAULT: "#0F5C55",
          50: "#EFFAF8",
          100: "#D5F1ED",
          200: "#ADE4DC",
          300: "#79CEC4",
          400: "#45B0A5",
          500: "#269189",
          600: "#1A746E",
          700: "#0F5C55",
          800: "#104A46",
          900: "#113E3B",
          950: "#052422",
        },
        /** Champagne gold accent. */
        gold: {
          DEFAULT: "#C2A06B",
          soft: "#D8BC8B",
          light: "#EBDCC0",
          ink: "#8A6D3A",
          deep: "#6F5527",
        },
        cream: {
          DEFAULT: "#FAF8F5",
          50: "#FEFDFB",
          100: "#FAF8F5",
          200: "#F2EDE5",
          300: "#E7DFD2",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        heading: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
        body: ["Montserrat", "system-ui", "sans-serif"],
        ui: ["Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-xl": ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      /**
       * Tailwind v3 only ships multiples of 5 in its opacity scale, which makes
       * values like `border-ink-900/8` fail to compile. Filling in 0–100 keeps
       * the design tokens expressive without arbitrary-value brackets.
       */
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, index) => [String(index), String(index / 100)]),
      ),
      spacing: {
        section: "5rem",
        "section-lg": "7rem",
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10, 42, 46, 0.04), 0 8px 24px -12px rgba(10, 42, 46, 0.12)",
        card: "0 2px 4px rgba(10, 42, 46, 0.03), 0 18px 40px -24px rgba(10, 42, 46, 0.22)",
        lift: "0 8px 16px -8px rgba(10, 42, 46, 0.16), 0 32px 64px -32px rgba(10, 42, 46, 0.28)",
        ring: "0 0 0 1px rgba(194, 160, 107, 0.45)",
      },
      borderRadius: {
        card: "1rem",
        pill: "999px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
