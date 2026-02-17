"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";

interface GradientHeroClientProps {
  headline: string;
  subtitle?: string | null;
  body?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}


const SPRING_CONFIG = { stiffness: 50, damping: 30, mass: 1 };

export function GradientHeroClient({
  headline,
  subtitle,
  body,
  ctaText,
  ctaUrl,
}: GradientHeroClientProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const blobAx = useMotionValue(0);
  const blobAy = useMotionValue(0);
  const blobBx = useMotionValue(0);
  const blobBy = useMotionValue(0);

  const springAx = useSpring(blobAx, SPRING_CONFIG);
  const springAy = useSpring(blobAy, SPRING_CONFIG);
  const springBx = useSpring(blobBx, SPRING_CONFIG);
  const springBy = useSpring(blobBy, SPRING_CONFIG);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      blobAx.set(x * 30);
      blobAy.set(y * 20);
      blobBx.set(x * -20);
      blobBy.set(y * -25);
    },
    [blobAx, blobAy, blobBx, blobBy],
  );

  const handleMouseLeave = useCallback(() => {
    blobAx.set(0);
    blobAy.set(0);
    blobBx.set(0);
    blobBy.set(0);
  }, [blobAx, blobAy, blobBx, blobBy]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate overflow-hidden bg-white px-6 py-14 sm:py-20 lg:px-8 lg:py-28"
    >
      {/* Decorative blob — top-right */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-10 right-1/2 -z-10 mr-10 hidden transform-gpu blur-3xl sm:block"
        style={{ x: springAx, y: springAy }}
      >
        <div className="blob-clip aspect-1097/845 w-274 bg-linear-to-tr from-pink-300 to-primary-300 opacity-20" />
      </motion.div>

      {/* Decorative blob — top-left */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:ml-16 sm:-top-112 sm:translate-x-0"
        style={{ x: springBx, y: springBy }}
      >
        <div className="blob-clip aspect-1097/845 w-274 bg-linear-to-tr from-pink-400 to-primary-400 opacity-15" />
      </motion.div>

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-5xl tracking-tight text-primary-600 sm:text-6xl lg:text-7xl">
          {headline}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg font-medium text-neutral-600 sm:text-xl">
            {subtitle}
          </p>
        )}
        {body && (
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            {body}
          </p>
        )}
        {ctaText && ctaUrl && (
          <div className="mt-10">
            <TrackedCtaLink
              href={ctaUrl}
              source="hero_gradient"
              className="rounded-full bg-pink-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              {ctaText}
              <span className="sr-only"> (opens in new tab)</span>
            </TrackedCtaLink>
          </div>
        )}
      </div>
    </section>
  );
}
