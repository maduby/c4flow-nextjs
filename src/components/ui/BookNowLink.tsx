"use client";

import { trackBookNow } from "@/lib/analytics";

interface BookNowLinkProps {
  href: string;
  className?: string;
  label?: string;
  source?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export function BookNowLink({
  href,
  className,
  label,
  source,
  ariaLabel,
  children,
}: BookNowLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackBookNow(label, source)}
      className={className}
      aria-label={ariaLabel}
    >
      {children || "Book Now"}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
