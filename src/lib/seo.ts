interface FaqEntry {
  question?: string | null;
  answer?: string | null;
}

interface FaqSection {
  _type?: string;
  faqs?: FaqEntry[] | null;
}

function isHttpUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isSetmoreUrl(href: string): boolean {
  if (!isHttpUrl(href)) return false;
  const hostname = new URL(href).hostname.toLowerCase();
  return hostname === "setmore.com" || hostname.endsWith(".setmore.com");
}

export function getExternalLinkRel(href: string): string | undefined {
  if (!isHttpUrl(href)) return undefined;

  const rel = ["noopener", "noreferrer"];
  if (isSetmoreUrl(href)) {
    rel.unshift("nofollow", "sponsored");
  }

  return rel.join(" ");
}

export function buildFaqJsonLd(
  sections: FaqSection[] | null | undefined,
): Record<string, unknown> | null {
  const mainEntity = (sections || [])
    .filter((section) => section?._type === "faqSection")
    .flatMap((section) => section.faqs || [])
    .map((faq) => ({
      name: faq.question?.trim() || "",
      text: faq.answer?.replace(/\s+/g, " ").trim() || "",
    }))
    .filter((faq) => faq.name && faq.text)
    .map((faq) => ({
      "@type": "Question",
      name: faq.name,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.text,
      },
    }));

  if (!mainEntity.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
