import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { MediaPlaceholder, PlaceholderBadge, SectionHeading, ValueList } from "@/components/ui/primitives";
import { aboutContent, facilityContent, teamMembers, values } from "@/content/sections";
import { clinic, scheduleConfirmed } from "@/content/site";

export const metadata: Metadata = {
  title: "About the practice",
  description:
    "About Dr. Bouamara Dental Clinic: how the practice works, what patients can expect, and the standards behind each appointment.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="bg-ink-900 py-16 text-white sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <SectionHeading
            tone="dark"
            as="h1"
            eyebrow={aboutContent.eyebrow}
            title={aboutContent.title}
            description={aboutContent.paragraphs[0]}
          />

          <div className="rounded-card border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
            <h2 className="font-heading text-xl text-white">At a glance</h2>
            <dl className="mt-5 space-y-4 font-body text-sm">
              <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                <dt className="text-white/55">Practice</dt>
                <dd className="text-right text-white/90">{clinic.name}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                <dt className="text-white/55">Country</dt>
                <dd className="text-white/90">{clinic.contact.country}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                <dt className="text-white/55">Languages</dt>
                <dd className="text-right text-white/90">{clinic.languages.join(" · ")}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-white/55">Opening hours</dt>
                <dd className="text-white/90">
                  {scheduleConfirmed ? "Confirmed" : "Being confirmed"}
                </dd>
              </div>
            </dl>
            {!scheduleConfirmed && (
              <p className="mt-5">
                <PlaceholderBadge label="Demo schedule" />
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Narrative — the remaining placeholder paragraphs, clearly labelled */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="The practice" title="How we work" />
            <div className="mt-6 space-y-5">
              {aboutContent.paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph} className="font-body text-base leading-relaxed text-ink-600">
                  {paragraph}
                </p>
              ))}
            </div>
            {aboutContent.isPlaceholder && (
              <PlaceholderBadge className="mt-6" label="Narrative copy pending" />
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-card border border-ink-900/10 bg-cream-50 p-7">
              <h3 className="font-heading text-xl text-ink-900">What to expect at a visit</h3>
              <ValueList
                className="mt-4"
                items={[
                  "A discussion of your concerns before any examination",
                  "An examination, with imaging only where clinically indicated",
                  "Findings explained in plain language, with alternatives",
                  "A written plan you can take away and consider",
                ]}
              />
            </div>

            <div className="rounded-card border border-gold-ink/25 bg-gold-ink/[0.04] p-7">
              <h3 className="font-heading text-xl text-ink-900">Equipment & environment</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-600">
                {facilityContent.body}
              </p>
              <PlaceholderBadge className="mt-4" label="Facility details pending" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-cream-100">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Principles"
            title="What guides the practice"
            description="These are the commitments the site is built around. The clinic should confirm or amend them before launch."
          />

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <li key={value.id} className="card p-7">
                <span aria-hidden="true" className="font-heading text-2xl text-gold-ink">
                  ◈
                </span>
                <h3 className="mt-4 font-heading text-xl text-ink-900">{value.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink-600">
                  {value.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="The team"
              title="Practitioners and staff"
              description="Profiles and qualifications are published only once the clinic has supplied and approved the exact wording."
            />
            <PlaceholderBadge label="Profiles pending" />
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <li key={member.id} className="card overflow-hidden">
                <MediaPlaceholder
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  label={member.name}
                  caption="Portrait pending"
                  className="aspect-4/5 w-full"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  icon="◍"
                />
                <div className="p-6">
                  <h3 className="font-heading text-xl text-ink-900">{member.name}</h3>
                  <p className="mt-1 font-ui text-sm text-brand-700">{member.role}</p>

                  {member.credentials ? (
                    <p className="mt-1 font-ui text-xs text-ink-500">{member.credentials}</p>
                  ) : (
                    <PlaceholderBadge className="mt-4" label="Role & credentials pending" />
                  )}

                  <p className="mt-4 font-body text-sm leading-relaxed text-ink-600">
                    {member.bio ?? "Biography to be supplied by the clinic."}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Questions before your first visit?"
        description="Send the clinic a message, or request an appointment and ask at your consultation."
        primaryLabel="Request an appointment"
      />
    </main>
  );
}
