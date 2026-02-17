import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { stegaClean } from "next-sanity";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import { GradientHeroClient } from "@/components/ui/GradientHeroClient";

interface HeroSectionProps {
  layout?: string | null;
  headline: string;
  subtitle?: string | null;
  tagline?: string | null;
  body?: string | null;
  backgroundImage?: {
    asset?: { _ref: string };
    alt?: string;
  } | null;
  overlayLogo?: {
    asset?: { _ref: string };
  } | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  siteLogoUrl?: string | null;
}

export function HeroSection({
  layout,
  headline,
  subtitle,
  tagline,
  body,
  backgroundImage,
  overlayLogo,
  ctaText,
  ctaUrl,
  siteLogoUrl,
}: HeroSectionProps) {
  const variant = stegaClean(layout) || "centered";

  if (variant === "split") {
    return <SplitHero {...{ headline, subtitle, body, backgroundImage, ctaText, ctaUrl }} />;
  }

  if (variant === "gradient") {
    return <GradientHeroClient {...{ headline, subtitle, body, ctaText, ctaUrl }} />;
  }

  return (
    <CenteredHero
      {...{ headline, subtitle, tagline, backgroundImage, overlayLogo, siteLogoUrl, ctaText, ctaUrl }}
    />
  );
}

/* ──────────────────────────────────────────────
   Centered: full background image + logo overlay
   Used on Homepage
   ────────────────────────────────────────────── */
function CenteredHero({
  headline,
  subtitle,
  tagline,
  backgroundImage,
  overlayLogo,
  siteLogoUrl,
  ctaText,
  ctaUrl,
}: Omit<HeroSectionProps, "layout" | "body">) {
  const logoSrc = overlayLogo?.asset
    ? urlFor(overlayLogo).width(320).url()
    : siteLogoUrl;

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden bg-primary-700 text-white"
      style={{ minHeight: "calc(100svh - var(--top-offset, 57px))" }}
    >
      {backgroundImage?.asset && (
        <>
          <Image
            src={urlFor(backgroundImage).width(1920).quality(85).url()}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary-700/65" aria-hidden="true" />
        </>
      )}
      {!backgroundImage?.asset && (
        <div
          className="absolute inset-0 bg-linear-to-br from-primary-700 via-primary-600 to-primary-500"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {logoSrc && (
          <Image
            src={logoSrc}
            alt={`${headline} logo`}
            width={160}
            height={167}
            className="mb-6 h-28 w-auto brightness-0 invert drop-shadow-lg md:h-36 lg:h-44"
            priority
          />
        )}
        <h1 className="font-heading text-5xl drop-shadow-md md:text-7xl lg:text-8xl">
          {headline}
        </h1>
        {subtitle && (
          <p className="mt-3 text-xl font-medium drop-shadow-sm md:text-2xl lg:text-3xl">
            {subtitle}
          </p>
        )}
        {tagline && (
          <p className="mt-2 text-lg italic text-primary-100 drop-shadow-sm md:text-xl">
            {tagline}
          </p>
        )}
        {ctaText && ctaUrl && (
          <TrackedCtaLink
            href={ctaUrl}
            source="hero_centered"
            className="mt-8 inline-block rounded-full bg-pink-500 px-8 py-3 text-lg font-medium text-white shadow-md hover:bg-pink-600"
          >
            {ctaText}
            <span className="sr-only"> (opens in new tab)</span>
          </TrackedCtaLink>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Split: text left, angled divider, image right
   Used on Classes, Contact pages
   ────────────────────────────────────────────── */
function SplitHero({
  headline,
  subtitle,
  body,
  backgroundImage,
  ctaText,
  ctaUrl,
}: Pick<HeroSectionProps, "headline" | "subtitle" | "body" | "backgroundImage" | "ctaText" | "ctaUrl">) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 lg:w-full lg:max-w-2xl">
          {/* Angled divider — only on desktop */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 fill-white lg:block"
          >
            <polygon points="0,0 90,0 50,100 0,100" />
          </svg>

          <div className="relative px-6 py-14 sm:py-20 lg:px-12 lg:py-32 lg:pr-0">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <h1 className="font-heading text-5xl tracking-tight text-primary-600 sm:text-6xl lg:text-7xl">
                {headline}
              </h1>
              {subtitle && (
                <p className="mt-4 text-lg font-medium text-neutral-600 sm:text-xl">
                  {subtitle}
                </p>
              )}
              {body && (
                <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
                  {body}
                </p>
              )}
              {ctaText && ctaUrl && (
                <div className="mt-10 flex items-center gap-x-5">
                  <TrackedCtaLink
                    href={ctaUrl}
                    source="hero_split"
                    className="rounded-full bg-pink-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                  >
                    {ctaText}
                    <span className="sr-only"> (opens in new tab)</span>
                  </TrackedCtaLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image — stacked on mobile, right half on desktop */}
      <div className="relative min-h-[240px] sm:min-h-[320px] lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:min-h-0">
        {backgroundImage?.asset ? (
          <Image
            src={urlFor(backgroundImage).width(1200).height(900).quality(85).url()}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary-100 via-pink-100 to-primary-50" />
        )}
      </div>
    </section>
  );
}

/* GradientHero is now a client component: see GradientHeroClient.tsx */
