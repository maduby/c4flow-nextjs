import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { stegaClean } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

interface SanityImage {
  asset?: { _ref?: string; _type?: string } | null;
  hotspot?: { x: number; y: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
}

interface RichTextSectionProps {
  heading?: string | null;
  content?: Array<Record<string, unknown>> | null;
  layout?: string | null;
  image?: SanityImage | null;
  imagePosition?: string | null;
}

export function RichTextSection({
  heading,
  content,
  layout,
  image,
  imagePosition,
}: RichTextSectionProps) {
  if (!content) return null;

  const cleanLayout = stegaClean(layout) || "centered";
  const cleanImagePos = stegaClean(imagePosition) || "right";
  const hasImage = cleanLayout === "textImage" && image?.asset;

  if (hasImage) {
    return (
      <section className="py-10 md:py-20">
        <Container>
          {heading && <SectionHeading>{heading}</SectionHeading>}
          <div
            className={cn(
              "grid items-start gap-8 md:grid-cols-2 md:gap-12 lg:gap-16",
              cleanImagePos === "left" && "md:[&>*:first-child]:order-2"
            )}
          >
            {/* Text column */}
            <div
              className={cn(
                "prose prose-base text-neutral-600 md:prose-lg",
                "[&_p]:mb-5 [&_p]:leading-relaxed",
                "prose-headings:font-heading prose-headings:text-primary-600",
                "[&_a]:text-pink-500 [&_a]:underline hover:[&_a]:no-underline"
              )}
            >
              <PortableText value={content as never} />
            </div>

            {/* Image column */}
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
              <Image
                src={urlFor(image).width(800).height(600).url()}
                alt={heading || ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-20">
      <Container>
        {heading && <SectionHeading>{heading}</SectionHeading>}
        <div
          className={cn(
            "prose prose-base mx-auto max-w-3xl text-neutral-600 md:prose-lg",
            "[&_p]:mb-5 [&_p]:leading-relaxed",
            "prose-headings:font-heading prose-headings:text-primary-600",
            "[&_a]:text-pink-500 [&_a]:underline hover:[&_a]:no-underline",
            cleanLayout === "left" && "text-left",
            cleanLayout === "centered" && "text-center"
          )}
        >
          <PortableText value={content as never} />
        </div>
      </Container>
    </section>
  );
}
