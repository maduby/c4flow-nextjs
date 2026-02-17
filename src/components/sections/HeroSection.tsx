import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";
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
    lqip?: string | null;
  } | null;
  sectionBackground?: {
    asset?: { _ref: string };
    lqip?: string | null;
  } | null;
  overlayLogo?: {
    asset?: { _ref: string };
    lqip?: string | null;
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
  sectionBackground,
  overlayLogo,
  ctaText,
  ctaUrl,
  siteLogoUrl,
}: HeroSectionProps) {
  const variant = stegaClean(layout) || "centered";

  if (variant === "split") {
    return <SplitHero {...{ headline, subtitle, body, backgroundImage, sectionBackground, ctaText, ctaUrl }} />;
  }

  if (variant === "gradient") {
    return <GradientHeroClient {...{ headline, subtitle, body, backgroundImage, ctaText, ctaUrl }} />;
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
    <section className="relative flex h-[calc(100svh_-_var(--header-h)_-_var(--banner-h))] items-center justify-center overflow-hidden bg-[#3d1f3a] text-white">
      {backgroundImage?.asset && (
        <>
          <Image
            src={urlFor(backgroundImage).width(1920).quality(85).url()}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
            {...(backgroundImage.lqip && {
              placeholder: "blur" as const,
              blurDataURL: backgroundImage.lqip,
            })}
          />
          <div className="absolute inset-0 bg-[#3d1f3a]/60" aria-hidden="true" />
        </>
      )}
      {!backgroundImage?.asset && (
        <div
          className="absolute inset-0 bg-linear-to-br from-[#3d1f3a] via-[#4a2249] to-pink-800"
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
          <h3 className="mt-4 text-base text-white drop-shadow-sm md:text-xl px-4 py-1.5 rounded-full bg-linear-to-r from-pink-500 to-pink-600 font-bold">
            {tagline}
          </h3>
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
  sectionBackground,
  ctaText,
  ctaUrl,
}: Pick<HeroSectionProps, "headline" | "subtitle" | "body" | "backgroundImage" | "sectionBackground" | "ctaText" | "ctaUrl">) {
  const hasSectionBg = !!sectionBackground?.asset;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Section background — desktop only */}
      {hasSectionBg && (
        <Image
          src={urlFor(sectionBackground).width(1920).height(800).url()}
          alt=""
          fill
          priority
          className="hidden object-cover lg:block"
          sizes="100vw"
          {...(sectionBackground.lqip && {
            placeholder: "blur" as const,
            blurDataURL: sectionBackground.lqip,
          })}
        />
      )}

      <div className="relative mx-auto max-w-7xl">
        <div className="relative z-10 lg:w-full lg:max-w-2xl">
          {/* Angled divider — only on desktop */}
          {!hasSectionBg && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 fill-white lg:block"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>
          )}

          <div className="relative px-6 py-14 sm:py-20 lg:px-12 lg:py-32 lg:pr-0">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <h1 className="font-heading text-5xl tracking-tight text-pink-700 sm:text-6xl lg:text-7xl">
                {headline}
              </h1>
              {subtitle && (
                <p className="mt-4 text-lg font-medium text-neutral-600 sm:text-xl">
                  {subtitle}
                </p>
              )}
              {body && (
                <p className="mt-6 text-base leading-relaxed text-neutral-500 sm:text-lg">
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
      <div
        className={cn(
          "relative min-h-[240px] sm:min-h-[320px] lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:min-h-0",
          hasSectionBg && "lg:[clip-path:polygon(18%_0%,100%_0%,100%_100%,0%_100%)]"
        )}
      >
        {backgroundImage?.asset ? (
          <Image
            src={urlFor(backgroundImage).width(1200).quality(85).url()}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            {...(backgroundImage.lqip && {
              placeholder: "blur" as const,
              blurDataURL: backgroundImage.lqip,
            })}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary-100 via-pink-100 to-primary-50" />
        )}
      </div>
    </section>
  );
}

/* GradientHero is now a client component: see GradientHeroClient.tsx */
