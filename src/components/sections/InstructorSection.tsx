import Image from "next/image";
import { Instagram } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PortableText } from "@portabletext/react";

interface InstructorSectionProps {
  heading?: string | null;
  instructor?: {
    name: string | null;
    title: string | null;
    experience: string | null;
    photo: { asset?: { _ref: string } } | null;
    bio: Array<Record<string, unknown>> | null;
    shortBio: string | null;
    instagramUrl: string | null;
    bookingUrl: string | null;
  } | null;
}

export function InstructorSection({
  heading,
  instructor,
}: InstructorSectionProps) {
  if (!instructor) return null;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading>{heading || "Meet Your Instructor"}</SectionHeading>

        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
          {/* Photo */}
          {instructor.photo?.asset && (
            <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
              <Image
                src={urlFor(instructor.photo)
                  .width(600)
                  .height(800)
                  .quality(85)
                  .url()}
                alt={instructor.name || "Instructor"}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Bio */}
          <div>
            <h3 className="font-heading text-3xl text-primary-600">
              {instructor.name}
            </h3>
            {instructor.title && (
              <p className="mt-1 font-medium text-pink-500">
                {instructor.title}
              </p>
            )}
            {instructor.experience && (
              <p className="mt-1 text-sm text-neutral-400">
                {instructor.experience}
              </p>
            )}

            <div className="mt-4 space-y-3 text-neutral-600">
              {instructor.bio ? (
                <PortableText value={instructor.bio as never} />
              ) : instructor.shortBio ? (
                <p>{instructor.shortBio}</p>
              ) : null}
            </div>

            <div className="mt-6 flex gap-3">
              {instructor.bookingUrl && (
                <a
                  href={instructor.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
                >
                  Book a Session
                </a>
              )}
              {instructor.instagramUrl && (
                <a
                  href={instructor.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
                  aria-label={`${instructor.name} on Instagram`}
                >
                  <Instagram size={16} />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
