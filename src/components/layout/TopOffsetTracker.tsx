"use client";

import { useEffect } from "react";

/**
 * Measures the combined height of everything above the main content
 * (announcement bar + header) and exposes it as a CSS custom property
 * so the hero can size itself to exactly fill the remaining viewport.
 *
 * Sets: --top-offset on <html>
 */
export function TopOffsetTracker() {
  useEffect(() => {
    function measure() {
      const header = document.getElementById("site-header");
      if (!header) return;
      const offset = header.offsetTop + header.offsetHeight;
      document.documentElement.style.setProperty(
        "--top-offset",
        `${offset}px`,
      );
    }

    measure();

    window.addEventListener("resize", measure);

    const observer = new MutationObserver(measure);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  return null;
}
