"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scrolls the window to the top on every client-side route change.
 * Uses `behavior: "instant"` so the CSS `scroll-behavior: smooth`
 * on <html> doesn't race with the page transition.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
