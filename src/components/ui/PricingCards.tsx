"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";

interface EnrichedBundle {
  _id: string;
  name: string;
  tagline?: string | null;
  originalPrice: number;
  effectivePrice: number | null;
  hasDiscount: boolean;
  note?: string | null;
  highlighted?: boolean | null;
}

interface PricingCardsProps {
  bundles: EnrichedBundle[];
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

export function PricingCards({ bundles }: PricingCardsProps) {
  const count = bundles.length;

  return (
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
      {bundles.map((pkg) => (
        <motion.div
          key={pkg._id}
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

          <div className="my-4">
            {pkg.hasDiscount && pkg.effectivePrice !== null ? (
              <>
                <p
                  className={cn(
                    "font-heading text-3xl lg:text-4xl",
                    pkg.highlighted ? "text-pink-500" : "text-primary-600"
                  )}
                >
                  {formatCurrency(pkg.effectivePrice)}
                </p>
                <p className="mt-1 text-sm text-neutral-400 line-through">
                  {formatCurrency(pkg.originalPrice)}
                </p>
              </>
            ) : (
              <p
                className={cn(
                  "font-heading text-3xl lg:text-4xl",
                  pkg.highlighted ? "text-pink-500" : "text-primary-600"
                )}
              >
                {formatCurrency(pkg.originalPrice)}
              </p>
            )}
          </div>

          {pkg.note && (
            <p className="text-xs text-neutral-400">{pkg.note}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
