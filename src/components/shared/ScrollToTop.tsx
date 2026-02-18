"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Temporarily disable CSS scroll-smooth so the reset is truly instant
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    // Re-enable after a tick so in-page anchor clicks still animate
    requestAnimationFrame(() => {
      html.style.scrollBehavior = "";
    });
  }, [pathname]);

  return null;
}
