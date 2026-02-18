import Image from "next/image";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";

interface MapSectionProps {
  heading?: string | null;
  additionalInfo?: string | null;
  logoUrl?: string | null;
}

const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Woodstock+Exchange,+66+Albert+Road,+Cape+Town,+8001";
const MAPS_PLACE_URL =
  "https://www.google.com/maps/place/Woodstock+Exchange/@-33.926702,18.4434095,17z/";

export function MapSection({
  heading,
  additionalInfo,
  logoUrl,
}: MapSectionProps) {
  return (
    <section className="bg-muted py-8 md:py-24">
      <Container>
        <SectionHeading>{heading || "Find Us"}</SectionHeading>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border shadow-card">
          {/* Map with marker overlay */}
          <div className="relative aspect-video w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1655.4!2d18.4434095!3d-33.926702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc67637fc7d7c7%3A0xa1f7a2c29c07fba2!2sWoodstock%20Exchange!5e0!3m2!1sen!2sza!4v1!5m2!1sen!2sza"
              className="h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="C-4 Flow Studio location at Woodstock Exchange, Cape Town"
            />

            {/* Custom marker tooltip overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pointer-events-auto relative -mt-28 flex flex-col items-center">
                {/* Tooltip card */}
                <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5">
                  {logoUrl && (
                    <Image
                      src={logoUrl}
                      alt=""
                      width={36}
                      height={38}
                      className="h-9 w-auto"
                    />
                  )}
                  <div>
                    <p className="text-sm font-bold text-neutral-800">
                      C-4 Flow Studio
                    </p>
                    <p className="text-xs text-neutral-400">
                      Woodstock Exchange
                    </p>
                  </div>
                </div>
                {/* Marker pin */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 shadow-md ring-2 ring-white">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div className="h-2 w-0.5 bg-pink-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Info bar with Navigate button */}
          <div className="flex flex-col gap-4 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MapPin
                size={20}
                className="mt-0.5 shrink-0 text-primary-500"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-neutral-800">
                  Woodstock Exchange, 66 Albert Road, Cape Town
                </p>
                {additionalInfo && (
                  <p className="mt-1 text-sm text-neutral-400">
                    {additionalInfo}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <TrackedCtaLink
                href={MAPS_DIRECTIONS_URL}
                source="map_navigate"
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
              >
                <Navigation size={14} />
                Navigate There
                <span className="sr-only"> (opens Google Maps)</span>
              </TrackedCtaLink>
              <TrackedCtaLink
                href={MAPS_PLACE_URL}
                source="map_view"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Google Maps</span>
              </TrackedCtaLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
