"use client";

import { ExternalLink } from "lucide-react";
import { trackBookNow } from "@/lib/analytics";

interface BookNowLinkProps {
  href: string;
  className?: string;
  label?: string;
  source?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  /** Hide the external-link icon (default: shown) */
  hideIcon?: boolean;
}

export function BookNowLink({
  href,
  className,
  label,
  source,
  ariaLabel,
  children,
  hideIcon,
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
      {!hideIcon && (
        <ExternalLink
          size={14}
          className="ml-1.5 inline-block -translate-y-px"
          aria-hidden="true"
        />
      )}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
