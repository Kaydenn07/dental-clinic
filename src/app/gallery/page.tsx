import type { Metadata } from "next";

import { ResultsGallery } from "@/components/gallery/ResultsGallery";
import { CtaBand } from "@/components/home/CtaBand";
import { MediaPlaceholder, PlaceholderBadge, SectionHeading } from "@/components/ui/primitives";
import { facility } from "@/content/media";
import { facilityContent } from "@/content/sections";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs and treatment results from Dr. Bouamara Dental Clinic. Clinic photography is still being prepared; this page shows where it will appear.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const photosPending = facility.every((photo) => !photo.src);

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
          {photosPending && (
            <div className="mb-10 flex flex-wrap items-center gap-3">
              <PlaceholderBadge label="Photography pending" />
              <p className="max-w-2xl font-body text-sm text-ink-600">
                Real photographs of the practice will replace these frames. No stock imagery is
                published anywhere on this site — unlicensed dental stock photos are both a
                licensing risk and misleading to patients.
              </p>
            </div>
          )}

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facility.map((photo) => (
              <li key={photo.id}>
                <figure className="overflow-hidden rounded-card border border-ink-900/10 bg-white shadow-soft">
                  <MediaPlaceholder
                    src={photo.src}
                    alt={`${photo.title} at Dr. Bouamara Dental Clinic`}
                    label={photo.title}
                    caption={photo.caption}
                    className="aspect-4/3 w-full"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="font-ui text-sm text-ink-800">{photo.title}</span>
                    <span className="font-ui text-xs text-ink-400">
                      {photo.src ? "Clinic photograph" : "Photo pending"}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Treatment results — consented cases only */}
      <ResultsGallery />

      <CtaBand
        title="Prefer to see the clinic in person?"
        description="Request an appointment and the clinic will confirm a time for your visit."
      />
    </main>
  );
}
