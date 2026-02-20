"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * On route changes, scroll to the hash target (if present) or to the
 * very top of the page. Temporarily overrides CSS `scroll-smooth` so
 * page transitions are instant — in-page anchor clicks still animate.
 *
 * Next.js's built-in scroll skips sticky/fixed elements (header, banner)
 * which leaves the page slightly offset, so we handle it manually.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";

    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView();
        requestAnimationFrame(() => {
          html.style.scrollBehavior = "";
        });
        return;
      }
    }

    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      html.style.scrollBehavior = "";
    });
  }, [pathname]);

  return null;
}
