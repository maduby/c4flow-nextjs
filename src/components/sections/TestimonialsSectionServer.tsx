import { sanityFetch } from "@/sanity/lib/live";
import { ALL_TESTIMONIALS_QUERY } from "@/sanity/lib/queries";
import { TestimonialsSection } from "./TestimonialsSection";

interface TestimonialsSectionServerProps {
  heading?: string | null;
  subtitle?: string | null;
}

export async function TestimonialsSectionServer({
  heading,
  subtitle,
}: TestimonialsSectionServerProps) {
  const { data: testimonials } = await sanityFetch({
    query: ALL_TESTIMONIALS_QUERY,
  });

  if (!testimonials?.length) return null;

  return (
    <TestimonialsSection
      heading={heading}
      subtitle={subtitle}
      testimonials={testimonials as never}
    />
  );
}
