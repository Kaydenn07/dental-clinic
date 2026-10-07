import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { Alert, MediaPlaceholder, PlaceholderBadge, SectionHeading } from "@/components/ui/primitives";
import { facilityContent, galleryItems } from "@/content/sections";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs of Dr. Bouamara Dental Clinic. Clinic photography is still being prepared; this page shows where it will appear.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <main>
      <section className="bg-ink-900 py-16 text-white sm:py-20">
        <div className="container-x">
          <SectionHeading
            tone="dark"
            as="h1"
            eyebrow={facilityContent.eyebrow}
            title="A look inside the clinic"
            description={facilityContent.body}
          />
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <PlaceholderBadge label="Photography pending" />
            <p className="font-body text-sm text-ink-600">
              Real photographs of the practice will replace these placeholders. No stock imagery is
              published because unlicensed dental stock photos are a common licensing risk.
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <li key={item.id}>
                <figure className="overflow-hidden rounded-card border border-ink-900/10 bg-white shadow-soft">
                  <MediaPlaceholder
                    src={item.image}
                    alt={`${item.title} at Dr. Bouamara Dental Clinic`}
                    label={item.title}
                    caption={item.caption}
                    className="aspect-4/3 w-full"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="font-ui text-sm text-ink-800">{item.title}</span>
                    <span className="font-ui text-xs text-ink-400">Photo pending</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <Alert tone="warning" className="mt-10" title="Patient photographs need consent">
            Before/after treatment photos are only published with documented, specific patient
            consent, and are never used with identifying details. This page is structured to hold
            them, but nothing is published until that consent exists.
          </Alert>
        </div>
      </section>

      <CtaBand
        title="Prefer to see the clinic in person?"
        description="Request an appointment and the clinic will confirm a time for your visit."
      />
    </main>
  );
}
