import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import { cn } from "@/lib/utils";

interface HeroCtaProps {
  href: string;
  source: string;
  children: React.ReactNode;
  size?: "default" | "lg";
  className?: string;
}

export function HeroCta({
  href,
  source,
  children,
  size = "default",
  className,
}: HeroCtaProps) {
  return (
    <TrackedCtaLink
      href={href}
      source={source}
      className={cn(
        "inline-block rounded-full bg-pink-500 font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500",
        size === "lg" ? "px-8 py-3 text-lg shadow-md" : "px-7 py-3 text-sm",
        className,
      )}
    >
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </TrackedCtaLink>
  );
}
