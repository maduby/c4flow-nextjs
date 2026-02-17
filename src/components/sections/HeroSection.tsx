import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { stegaClean } from "next-sanity";

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
    return <GradientHero {...{ headline, subtitle, body, ctaText, ctaUrl }} />;
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
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-primary-700 text-white">
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
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-pink-500 px-8 py-3 text-lg font-medium text-white shadow-md hover:bg-pink-600"
          >
            {ctaText}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Split: text left, image right with pink gradient
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
    <section className="relative overflow-hidden bg-linear-to-br from-pink-50 via-primary-50 to-pink-50">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        {/* Text side */}
        <div className="flex flex-col justify-center px-6 py-16 md:py-24 lg:px-12 lg:py-32">
          <h1 className="font-heading text-4xl text-primary-600 md:text-5xl lg:text-6xl">
            {headline}
          </h1>
          {subtitle && (
            <p className="mt-3 text-lg font-medium text-neutral-600 md:text-xl">
              {subtitle}
            </p>
          )}
          {body && (
            <p className="mt-4 max-w-lg leading-relaxed text-neutral-400">
              {body}
            </p>
          )}
          {ctaText && ctaUrl && (
            <div className="mt-8">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-pink-500 px-8 py-3 text-sm font-medium text-white hover:bg-pink-600"
              >
                {ctaText}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          )}
        </div>

        {/* Image side */}
        {backgroundImage?.asset && (
          <div className="relative min-h-[300px] md:min-h-[500px]">
            <Image
              src={urlFor(backgroundImage).width(960).height(720).quality(85).url()}
              alt={backgroundImage.alt || ""}
              fill
              priority
              className="object-cover"
            />
            {/* Soft gradient overlay blending into the text side */}
            <div
              className="absolute inset-0 bg-linear-to-r from-pink-50/60 via-transparent to-transparent md:from-pink-50/40"
              aria-hidden="true"
            />
          </div>
        )}
        {!backgroundImage?.asset && (
          <div className="relative min-h-[300px] bg-linear-to-br from-primary-200 via-pink-200 to-primary-100 md:min-h-[500px]" />
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Gradient: centered text on a soft gradient
   Used on About "Our Mission" page
   ────────────────────────────────────────────── */
function GradientHero({
  headline,
  subtitle,
  body,
  ctaText,
  ctaUrl,
}: Pick<HeroSectionProps, "headline" | "subtitle" | "body" | "ctaText" | "ctaUrl">) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-pink-50 via-primary-50 to-pink-50 py-20 md:py-28 lg:py-36">
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h1 className="font-heading text-4xl text-primary-600 md:text-5xl lg:text-6xl">
          {headline}
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg font-medium text-neutral-600 md:text-xl">
            {subtitle}
          </p>
        )}
        {body && (
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-neutral-400">
            {body}
          </p>
        )}
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-pink-500 px-8 py-3 text-sm font-medium text-white hover:bg-pink-600"
          >
            {ctaText}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
      </div>
    </section>
  );
}
