import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";
import { stegaClean } from "next-sanity";

interface CtaSectionProps {
  heading: string;
  subtitle?: string | null;
  buttonText: string;
  buttonUrl?: string | null;
  style?: string | null;
}

export function CtaSection({
  heading,
  subtitle,
  buttonText,
  buttonUrl,
  style,
}: CtaSectionProps) {
  const cleanStyle = stegaClean(style) || "gradient";

  return (
    <section
      className={cn(
        "py-16 md:py-24",
        cleanStyle === "gradient" &&
          "bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 text-white",
        cleanStyle === "dark" && "bg-primary-700 text-white",
        cleanStyle === "light" && "bg-muted text-neutral-800"
      )}
    >
      <Container className="text-center">
        <h2
          className={cn(
            "font-heading text-3xl md:text-5xl",
            cleanStyle === "light" ? "text-primary-600" : "text-white"
          )}
        >
          {heading}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mx-auto mt-4 max-w-xl text-lg",
              cleanStyle === "light" ? "text-neutral-400" : "text-primary-100"
            )}
          >
            {subtitle}
          </p>
        )}
        {buttonUrl && (
          <a
            href={buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-8 inline-block rounded-full px-8 py-3 text-lg font-medium",
              cleanStyle === "light"
                ? "bg-pink-500 text-white hover:bg-pink-600"
                : "bg-white text-primary-600 hover:bg-primary-50"
            )}
          >
            {buttonText}
          </a>
        )}
      </Container>
    </section>
  );
}
