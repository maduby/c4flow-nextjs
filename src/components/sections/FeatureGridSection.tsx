import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface Feature {
  _key: string;
  title: string;
  description: string;
  icon?: { asset?: { _ref: string } } | null;
}

interface FeatureGridSectionProps {
  heading?: string | null;
  features?: Feature[] | null;
}

export function FeatureGridSection({
  heading,
  features,
}: FeatureGridSectionProps) {
  if (!features?.length) return null;

  return (
    <section className="py-16 md:py-24">
      <Container>
        {heading && <SectionHeading>{heading}</SectionHeading>}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature._key}
              className="rounded-2xl border border-border bg-white p-8 shadow-card transition-shadow hover:shadow-card-hover"
            >
              {feature.icon?.asset && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50">
                  <Image
                    src={urlFor(feature.icon).width(56).height(56).url()}
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
              )}
              <h3 className="mb-2 font-body text-xl font-bold text-neutral-800">
                {feature.title}
              </h3>
              <p className="text-neutral-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
