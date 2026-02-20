"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * On route changes, instantly scroll to the hash target (if present)
 * or to the top of the page. This overrides the CSS `scroll-smooth`
 * on `<html>` so page transitions don't slowly drift upward.
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
