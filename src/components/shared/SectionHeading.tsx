import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string | null;
  as?: "h1" | "h2" | "h3";
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  children,
  subtitle,
  as: Tag = "h2",
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        className
      )}
    >
      <Tag className="font-heading text-3xl text-primary-600 md:text-4xl lg:text-5xl">
        {children}
      </Tag>
      {subtitle && (
        <p className="mt-3 text-lg text-neutral-400">{subtitle}</p>
      )}
    </div>
  );
}
