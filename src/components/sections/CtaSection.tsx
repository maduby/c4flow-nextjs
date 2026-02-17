"use client";

import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";
import { stegaClean } from "next-sanity";
import { motion } from "framer-motion";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";

interface CtaSectionProps {
  heading: string;
  subtitle?: string | null;
  buttonText: string;
  buttonUrl?: string | null;
  style?: string | null;
}

export function CtaSection({
  heading,
  subtitle,
  buttonText,
  buttonUrl,
  style,
}: CtaSectionProps) {
  const cleanStyle = stegaClean(style) || "gradient";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-20 md:py-28",
        cleanStyle === "gradient" &&
          "animated-gradient bg-linear-to-br from-primary-700 via-primary-600 to-pink-500 text-white",
        cleanStyle === "dark" && "bg-primary-700 text-white",
        cleanStyle === "light" && "bg-muted text-neutral-800"
      )}
    >
      {/* Decorative blurred orb */}
      {cleanStyle !== "light" && (
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl"
          aria-hidden="true"
        />
      )}

      <Container className="relative z-10 text-center">
        <motion.h2
          className={cn(
            "font-heading text-3xl md:text-5xl",
            cleanStyle === "light" ? "text-primary-600" : "text-white"
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
              cleanStyle === "light" ? "text-neutral-400" : "text-primary-100"
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
