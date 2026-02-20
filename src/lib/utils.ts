import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic currency formatter — avoids Intl.NumberFormat which can
 * produce different Unicode space characters on Node vs the browser,
 * causing React hydration mismatches.
 */
export function formatCurrency(amount: number): string {
  const whole = Math.round(amount).toString();
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `R ${grouped}`;
}
