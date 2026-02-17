"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { trackBannerClick, trackBannerDismiss } from "@/lib/analytics";

const STORAGE_KEY = "c4flow-banner-dismissed";
const SCROLL_THRESHOLD = 80;

interface AnnouncementBarProps {
  text: string;
  link?: string | null;
  /** Sanity _updatedAt — used so the banner re-appears after the editor changes it */
  version?: string | null;
}

export function AnnouncementBar({ text, link, version }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  /* ── localStorage check ─────────────────────────── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === version) {
        setDismissed(true);
        document.documentElement.style.setProperty("--banner-h", "0px");
      }
    } catch {
      /* localStorage unavailable — keep showing */
    }
  }, [version]);

  /* ── Measure header + banner heights (pixel-perfect sticky alignment) ── */
  useEffect(() => {
    if (dismissed) return;

    const header = document.querySelector("header");

    function sync() {
      if (header) {
        document.documentElement.style.setProperty(
          "--header-h",
          `${header.offsetHeight}px`,
        );
      }
      if (bannerRef.current) {
        document.documentElement.style.setProperty(
          "--banner-h",
          `${bannerRef.current.offsetHeight}px`,
        );
      }
    }

    sync();

    const ro = new ResizeObserver(sync);
    if (header) ro.observe(header);
    if (bannerRef.current) ro.observe(bannerRef.current);
    return () => ro.disconnect();
  }, [dismissed]);

  /* ── Scroll-direction show / hide ───────────────── */
  useEffect(() => {
    if (dismissed) return;

    function onScroll() {
      const currentY = window.scrollY;
      const shouldHide =
        currentY > SCROLL_THRESHOLD && currentY > lastScrollY.current;
      lastScrollY.current = currentY;
      setHidden(shouldHide);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  /* ── Dismiss handler ────────────────────────────── */
  function dismiss() {
    setDismissed(true);
    trackBannerDismiss();
    document.documentElement.style.setProperty("--banner-h", "0px");
    try {
      if (version) localStorage.setItem(STORAGE_KEY, version);
    } catch {
      /* localStorage unavailable */
    }
  }

  if (dismissed) return null;

  const content = (
    <span className="text-sm font-medium text-white">{text}</span>
  );

  return (
    <div
      ref={bannerRef}
      role="status"
      aria-label="Announcement"
      className={`sticky top-(--header-h) z-40 flex items-center justify-center gap-2 bg-pink-500 px-4 py-2 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {link ? (
        <a
          href={link}
          onClick={trackBannerClick}
          className="underline decoration-white/0 underline-offset-2 hover:decoration-white/70"
        >
          {content}
        </a>
      ) : (
        content
      )}
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
