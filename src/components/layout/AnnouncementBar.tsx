"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { trackBannerClick, trackBannerDismiss } from "@/lib/analytics";

const STORAGE_KEY = "c4flow-banner-dismissed";

interface AnnouncementBarProps {
  text: string;
  link?: string | null;
  /** Sanity _updatedAt — used so the banner re-appears after the editor changes it */
  version?: string | null;
}

export function AnnouncementBar({ text, link, version }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed !== version) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [version]);

  function dismiss() {
    setVisible(false);
    trackBannerDismiss();
    try {
      if (version) {
        localStorage.setItem(STORAGE_KEY, version);
      }
    } catch {
      /* localStorage unavailable (private browsing, etc.) */
    }
  }

  if (!visible) return null;

  const content = (
    <span className="text-sm font-medium text-white">{text}</span>
  );

  return (
    <div
      role="status"
      aria-label="Announcement"
      className="relative flex items-center justify-center gap-2 bg-pink-500 px-4 py-2"
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
