import { PortableText } from "@portabletext/react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { stegaClean } from "next-sanity";

interface RichTextSectionProps {
  heading?: string | null;
  content?: Array<Record<string, unknown>> | null;
  layout?: string | null;
}

export function RichTextSection({
  heading,
  content,
  layout,
}: RichTextSectionProps) {
  if (!content) return null;

  const cleanLayout = stegaClean(layout) || "centered";

  return (
    <section className="py-16 md:py-24">
      <Container>
        {heading && <SectionHeading>{heading}</SectionHeading>}
        <div
          className={cn(
            "prose prose-lg mx-auto max-w-3xl text-neutral-600",
            "prose-headings:font-heading prose-headings:text-primary-600",
            "prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline",
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
