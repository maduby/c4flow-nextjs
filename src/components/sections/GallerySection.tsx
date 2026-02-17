import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GalleryGrid } from "@/components/ui/GalleryGrid";

interface GalleryImage {
  _key: string;
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
}

interface GallerySectionProps {
  heading?: string | null;
  subtitle?: string | null;
  images?: GalleryImage[] | null;
}

export function GallerySection({
  heading,
  subtitle,
  images,
}: GallerySectionProps) {
  if (!images?.length) return null;

  const preparedImages = images
    .filter((img) => img.asset)
    .map((img) => ({
      _key: img._key,
      thumbUrl: urlFor(img).width(600).height(600).quality(80).url(),
      fullUrl: urlFor(img).width(1600).quality(90).url(),
      alt: img.alt || "Gallery image",
      caption: img.caption || null,
    }));

  return (
    <section className="bg-muted py-16 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "Gallery"}
        </SectionHeading>

        <GalleryGrid images={preparedImages} />
      </Container>
    </section>
  );
}
