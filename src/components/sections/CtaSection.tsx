"use client";

import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";
import { stegaClean } from "next-sanity";
import { motion } from "framer-motion";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import { urlFor } from "@/sanity/lib/image";

interface SanityImage {
  asset?: { _ref?: string; _type?: string } | null;
  hotspot?: { x: number; y: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
}

interface CtaSectionProps {
  heading: string;
  subtitle?: string | null;
  buttonText: string;
  buttonUrl?: string | null;
  style?: string | null;
  backgroundImage?: SanityImage | null;
}

export function CtaSection({
  heading,
  subtitle,
  buttonText,
  buttonUrl,
  style,
  backgroundImage,
}: CtaSectionProps) {
  const cleanStyle = stegaClean(style) || "gradient";
  const hasBgImage = cleanStyle === "bgImage" && backgroundImage?.asset;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-16 md:py-28",
        cleanStyle === "gradient" &&
          "animated-gradient bg-linear-to-br from-primary-700 via-primary-600 to-pink-500 text-white",
        cleanStyle === "dark" && "bg-primary-700 text-white",
        cleanStyle === "light" && "bg-muted text-neutral-800",
        hasBgImage && "text-neutral-800"
      )}
    >
      {/* Background image */}
      {hasBgImage && (
        <Image
          src={urlFor(backgroundImage).width(1920).height(800).url()}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      )}

      {/* Decorative blurred orb */}
      {cleanStyle !== "light" && !hasBgImage && (
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl"
          aria-hidden="true"
        />
      )}

      <Container className="relative z-10 text-center">
        <motion.h2
          className={cn(
            "font-heading text-3xl md:text-5xl",
            cleanStyle === "light" || hasBgImage
              ? "text-neutral-800"
              : "text-white"
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h2>
        {subtitle && (
          <motion.p
            className={cn(
              "mx-auto mt-4 max-w-xl text-lg",
              cleanStyle === "light" || hasBgImage
                ? "text-neutral-500"
                : "text-primary-100"
            )}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}
        {buttonUrl && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TrackedCtaLink
              href={buttonUrl}
              source="cta_section"
              className={cn(
                "mt-8 inline-block rounded-full px-8 py-3.5 text-lg font-medium shadow-md transition-transform duration-200 hover:scale-105",
                cleanStyle === "light"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : hasBgImage
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-white text-primary-600 hover:bg-primary-50"
              )}
            >
              {buttonText}
            </TrackedCtaLink>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
