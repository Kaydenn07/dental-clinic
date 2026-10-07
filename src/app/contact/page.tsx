import type { Metadata } from "next";
import { RiMailLine, RiMapPin2Line, RiPhoneLine, RiTimeLine } from "react-icons/ri";

import { ContactForm } from "@/components/contact/ContactForm";
import { Alert, PlaceholderBadge, SectionHeading } from "@/components/ui/primitives";
import { clinic, scheduleConfirmed } from "@/content/site";
import { getOpeningHours } from "@/lib/queries/site";
import { toTelHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Dr. Bouamara Dental Clinic: send a message, request an appointment, or find the practice. Contact details and opening hours are still being confirmed.",
  alternates: { canonical: "/contact" },
};

/** Formats "09:00" → "9:00 AM" for display. */
function displayTime(value: string | null): string {
  if (!value) return "—";
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 1, hour ?? 0, minute ?? 0)));
}

export default async function ContactPage() {
  const hours = await getOpeningHours();
  const addressIsPlaceholder = clinic.contact.addressLine.toLowerCase().includes("to be confirmed");

  return (
    <main>
      <section className="bg-ink-900 py-16 text-white sm:py-20">
        <div className="container-x">
          <SectionHeading
            tone="dark"
            as="h1"
            eyebrow="Contact"
            title="Talk to the clinic"
            description="Send a message and the clinic will get back to you. For urgent problems, please call."
          />
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          {/* Form */}
          <div className="card p-7 lg:p-10">
            <h2 className="font-heading text-2xl text-ink-900">Send a message</h2>
            <p className="mt-2 font-body text-sm text-ink-600">
              Fields marked with an asterisk are required.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="card p-7">
              <h2 className="font-heading text-xl text-ink-900">Clinic details</h2>

              <ul className="mt-5 space-y-5">
                <li className="flex gap-4">
                  <RiMapPin2Line aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" />
                  <div>
                    <p className="font-ui text-xs uppercase tracking-wider text-ink-500">Address</p>
                    <p className="mt-1 font-body text-sm text-ink-900">
                      {clinic.contact.addressLine}
                    </p>
                    {addressIsPlaceholder && (
                      <PlaceholderBadge className="mt-2" label="Address pending" />
                    )}
                  </div>
                </li>

                <li className="flex gap-4">
                  <RiPhoneLine aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" />
                  <div>
                    <p className="font-ui text-xs uppercase tracking-wider text-ink-500">Phone</p>
                    <p className="mt-1 font-body text-sm">
                      <a
                        href={toTelHref(clinic.contact.phone)}
                        className="text-brand-700 hover:text-brand-800"
                      >
                        {clinic.contact.phoneDisplay}
                      </a>
                      <span className="sr-only"> (placeholder number)</span>
                    </p>
                    <PlaceholderBadge className="mt-2" label="Number pending" />
                  </div>
                </li>

                <li className="flex gap-4">
                  <RiMailLine aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" />
                  <div>
                    <p className="font-ui text-xs uppercase tracking-wider text-ink-500">Email</p>
                    <p className="mt-1 font-body text-sm">
                      <a
                        href={`mailto:${clinic.contact.email}`}
                        className="text-brand-700 hover:text-brand-800"
                      >
                        {clinic.contact.email}
                      </a>
                    </p>
                    <PlaceholderBadge className="mt-2" label="Email pending" />
                  </div>
                </li>
              </ul>

              <Alert tone="warning" className="mt-6" title="Placeholder contact details">
                These details are placeholders and are not connected to the clinic yet. Replace them
                in <code className="font-mono text-xs">src/content/site.ts</code> before launch.
              </Alert>
            </div>

            <div className="card p-7">
              <h2 className="flex items-center gap-2 font-heading text-xl text-ink-900">
                <RiTimeLine aria-hidden="true" className="h-5 w-5 text-gold-ink" />
                Opening hours
              </h2>

              <dl className="mt-5 divide-y divide-ink-900/8">
                {hours.map((day) => (
                  <div key={day.weekday} className="flex items-center justify-between py-2.5">
                    <dt className="font-ui text-sm text-ink-700">{day.label}</dt>
                    <dd className="font-ui text-sm text-ink-900">
                      {day.closed || !day.open || !day.close
                        ? "Closed"
                        : `${displayTime(day.open)} – ${displayTime(day.close)}`}
                    </dd>
                  </div>
                ))}
              </dl>

              {!scheduleConfirmed && (
                <div className="mt-5">
                  <PlaceholderBadge label="Demo schedule" />
                  <p className="mt-2 font-body text-xs leading-relaxed text-ink-500">
                    {clinic.scheduleNotice}
                  </p>
                </div>
              )}
            </div>

            <div className="card p-7">
              <h2 className="font-heading text-xl text-ink-900">Languages</h2>
              <p className="mt-2 font-body text-sm text-ink-600">
                {clinic.languages.join(" · ")}
              </p>
              <PlaceholderBadge className="mt-3" label="To confirm" />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="Find us"
            title="Location"
            description="A map will be embedded once the clinic's exact address is confirmed."
          />

          <div className="mt-8 overflow-hidden rounded-card border border-ink-900/10">
            {clinic.contact.mapEmbedUrl ? (
              <iframe
                src={clinic.contact.mapEmbedUrl}
                title={`Map showing the location of ${clinic.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[24rem] w-full border-0"
              />
            ) : (
              <div className="flex h-[24rem] flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#f2ede5,#e7dfd2)] px-6 text-center">
                <RiMapPin2Line aria-hidden="true" className="h-8 w-8 text-gold-ink" />
                <p className="font-heading text-xl text-ink-900">Map placeholder</p>
                <p className="max-w-md font-body text-sm text-ink-600">
                  Set <code className="font-mono text-xs">clinic.contact.mapEmbedUrl</code> to a
                  Google Maps embed URL and it will render here. No address is invented on this
                  site.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
