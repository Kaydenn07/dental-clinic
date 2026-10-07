import type { Metadata, Viewport } from "next";

import "./globals.css";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { clinic, scheduleConfirmed } from "@/content/site";
import { appUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${clinic.name} — ${clinic.tagline}`,
    template: `%s · ${clinic.name}`,
  },
  description:
    "Dr. Bouamara Dental Clinic — general and specialist dental care. Request an appointment online and the clinic will confirm your time. This site is a work in progress: contact details, photography and opening hours are still being confirmed.",
  applicationName: clinic.name,
  keywords: [
    "dental clinic",
    "dentist",
    "dental appointment",
    "Dr. Bouamara",
    "clinic dentaire",
  ],
  authors: [{ name: clinic.name }],
  openGraph: {
    type: "website",
    siteName: clinic.name,
    title: `${clinic.name} — ${clinic.tagline}`,
    description:
      "Request a dental appointment online. Clear explanations, unhurried appointments and modern equipment.",
    url: appUrl,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${clinic.name} — ${clinic.tagline}`,
    description: "Request a dental appointment online at Dr. Bouamara Dental Clinic.",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: { telephone: true, address: false, email: true },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#0A2A2E",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

/**
 * Structured data.
 *
 * Only fields that are actually known are emitted. Address, telephone and
 * opening hours are intentionally omitted (they are still placeholders) —
 * publishing invented values in JSON-LD would mislead search engines and
 * patients. Re-add them once the clinic confirms its details; see README.
 */
function JsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.name,
    url: appUrl,
    description: `${clinic.tagline} General and specialist dental care.`,
    availableLanguage: clinic.languages,
    ...(clinic.foundedYear ? { foundingDate: String(clinic.foundedYear) } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Static, developer-authored JSON — no user input is interpolated.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-cream-100">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <SiteHeader />

        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>

        <SiteFooter />
        <JsonLd />

        {!scheduleConfirmed && (
          <div className="sr-only">
            Notice: this website is still being completed. Opening hours currently shown are a
            demonstration schedule, and some contact details are placeholders.
          </div>
        )}
      </body>
    </html>
  );
}
