"use client";

import { trackBookNow, trackOutboundLink } from "@/lib/analytics";
import { getExternalLinkRel } from "@/lib/seo";

interface TrackedCtaLinkProps {
  href: string;
  className?: string;
  source?: string;
  children: React.ReactNode;
}

export function TrackedCtaLink({
  href,
  className,
  source,
  children,
}: TrackedCtaLinkProps) {
  function handleClick() {
    trackBookNow(undefined, source || "hero_cta");
    trackOutboundLink(href, source);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel={getExternalLinkRel(href)}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
