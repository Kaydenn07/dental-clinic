import type { Metadata } from "next";

import { ResultsGallery } from "@/components/gallery/ResultsGallery";
import { CtaBand } from "@/components/home/CtaBand";
import { MediaPlaceholder, PlaceholderBadge, SectionHeading } from "@/components/ui/primitives";
import { facility } from "@/content/media";
import { facilityContent } from "@/content/sections";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Treatment results published with the patient's consent, and a look inside Dr. Bouamara Dental Clinic. Illustrative views are marked as such.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const photosPending = facility.every((photo) => !photo.src);
  const illustrativeCount = facility.filter((photo) => photo.illustrative).length;

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
                Real photographs of the practice will replace these frames. Stock dental imagery is
                not published as if it showed this clinic.
              </p>
            </div>
          )}

          {!photosPending && illustrativeCount > 0 && (
            <div className="mb-10 flex flex-wrap items-center gap-3">
              <PlaceholderBadge label={`${illustrativeCount} illustrative views`} />
              <p className="max-w-2xl font-body text-sm text-ink-600">
                The frames marked <span className="font-ui text-xs uppercase tracking-eyebrow">
                  Illustrative view
                </span>{" "}
                are stand-ins that hold the place of the clinic&rsquo;s own photographs — they do not
                show this practice. The treatment results further down the page are the
                clinic&rsquo;s own, published with the patient&rsquo;s consent.
              </p>
            </div>
          )}

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facility.map((photo) => (
              <li key={photo.id}>
                <figure className="overflow-hidden rounded-card border border-ink-900/10 bg-white shadow-soft">
                  <MediaPlaceholder
                    src={photo.src}
                    alt={
                      photo.illustrative
                        ? `Illustrative view of a ${photo.title.toLowerCase()}`
                        : `${photo.title} at Dr. Bouamara Dental Clinic`
                    }
                    label={photo.title}
                    caption={photo.caption}
                    className="aspect-4/3 w-full"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="font-ui text-sm text-ink-800">{photo.title}</span>
                    <span className="font-ui text-xs text-ink-400">
                      {!photo.src
                        ? "Photo pending"
                        : photo.illustrative
                          ? "Illustrative view"
                          : "Clinic photograph"}
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
