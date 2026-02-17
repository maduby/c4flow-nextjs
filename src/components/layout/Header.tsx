"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trackNavClick, trackBookNow } from "@/lib/analytics";

interface HeaderProps {
  siteName: string;
  logoUrl?: string | null;
}

export function Header({ siteName, logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80"
          aria-label={`${siteName} — Go to homepage`}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={44}
              height={46}
              className="h-10 w-auto md:h-11"
              priority
            />
          ) : null}
          <span className="font-heading text-xl text-primary-600 md:text-2xl">
            {siteName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 underline decoration-primary-400/0 underline-offset-4 hover:text-primary-500 hover:decoration-primary-400/50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://movetoexpresswithc4flow.setmore.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-pink-500 px-5 py-2 text-sm font-medium text-white hover:bg-pink-600"
          >
            Book Now
            <span className="sr-only"> (opens in new tab)</span>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        role="region"
        aria-label="Mobile navigation"
        className={cn(
          "overflow-hidden border-t border-border transition-all duration-300 md:hidden",
          mobileMenuOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://movetoexpresswithc4flow.setmore.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mt-2 rounded-full bg-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-pink-600"
          >
            Book Now
            <span className="sr-only"> (opens in new tab)</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
