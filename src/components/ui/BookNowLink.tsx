"use client";

import { trackBookNow } from "@/lib/analytics";

interface BookNowLinkProps {
  href: string;
  className?: string;
  label?: string;
  source?: string;
}

export function BookNowLink({
  href,
  className,
  label,
  source,
}: BookNowLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackBookNow(label, source)}
      className={className}
    >
      Book Now
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
