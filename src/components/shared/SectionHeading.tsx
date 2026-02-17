"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string | null;
  as?: "h1" | "h2" | "h3";
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  children,
  subtitle,
  as: Tag = "h2",
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Tag className="font-heading text-3xl text-primary-600 md:text-4xl lg:text-5xl">
        {children}
      </Tag>
      {/* Decorative gradient underline */}
      <motion.div
        className={cn(
          "mx-auto mt-4 h-0.5 rounded-full bg-linear-to-r from-primary-300 via-pink-300 to-primary-200",
          align === "left" && "mx-0"
        )}
        aria-hidden="true"
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      />
      {subtitle && (
        <motion.p
          className="mt-4 text-lg text-neutral-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
