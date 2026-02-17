"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

interface MotionDivProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  initial?: string;
  whileInView?: string;
  viewport?: { once?: boolean; amount?: number };
  custom?: number;
}

/**
 * Thin client wrapper around motion.div for use in server components
 * that need scroll-triggered animations on their children.
 */
export function MotionDiv({
  children,
  className,
  variants,
  initial = "hidden",
  whileInView = "visible",
  viewport = { once: true, amount: 0.2 },
  custom,
}: MotionDivProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      custom={custom}
    >
      {children}
    </motion.div>
  );
}
