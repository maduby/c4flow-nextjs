"use client";

import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingPackage {
  _key: string;
  name: string;
  tagline?: string | null;
  price: number;
  note?: string | null;
  highlighted?: boolean | null;
}

interface PricingSectionProps {
  heading: string;
  subtitle?: string | null;
  packages?: PricingPackage[] | null;
  footerNote?: string | null;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/**
 * Turns "Contact Us" (case-insensitive) inside a plain string
 * into a Next.js Link pointing to /contact.
 */
function FooterNote({ text }: { text: string }) {
  const parts = text.split(/(Contact Us)/i);
  return (
    <p className="mt-8 text-center text-sm text-neutral-400">
      {parts.map((part, i) =>
        /^contact us$/i.test(part) ? (
          <Link
            key={i}
            href="/contact"
            className="font-medium text-pink-500 underline hover:no-underline"
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export function PricingSection({
  heading,
  subtitle,
  packages,
  footerNote,
}: PricingSectionProps) {
  if (!packages?.length) return null;

  const count = packages.length;

  return (
    <section className="py-12 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>{heading}</SectionHeading>

        <motion.div
          className={cn(
            "mx-auto grid max-w-5xl gap-5",
            count <= 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          )}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg._key}
              variants={cardVariants}
              className={cn(
                "flex flex-col items-center justify-between rounded-2xl border px-5 py-7 text-center",
                pkg.highlighted
                  ? "border-pink-200 bg-pink-50"
                  : "border-border/60 bg-white"
              )}
            >
              <div>
                <h3
                  className={cn(
                    "font-heading text-lg",
                    pkg.highlighted ? "text-pink-600" : "text-primary-600"
                  )}
                >
                  {pkg.name}
                </h3>
                {pkg.tagline && (
                  <p className="mx-auto mt-1.5 max-w-[18ch] text-xs leading-snug text-neutral-400">
                    {pkg.tagline}
                  </p>
                )}
              </div>

              <p
                className={cn(
                  "my-4 font-heading text-3xl lg:text-4xl",
                  pkg.highlighted ? "text-pink-500" : "text-primary-600"
                )}
              >
                {formatCurrency(pkg.price)}
              </p>

              {pkg.note && (
                <p className="text-xs text-neutral-400">{pkg.note}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {footerNote && <FooterNote text={footerNote} />}
      </Container>
    </section>
  );
}
