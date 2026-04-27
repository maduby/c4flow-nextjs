import type {
  BundleKnowledge,
  ClassKnowledge,
  KnowledgeBase,
  SiteKnowledge,
} from "@/lib/catalog";

const SCHEMA_DAY_MAP: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

function buildPostalAddress(site: SiteKnowledge) {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.province,
    postalCode: site.address.postalCode,
    addressCountry: "ZA",
  };
}

function buildPlace(site: SiteKnowledge) {
  return {
    "@type": "Place",
    name: site.address.building || site.name,
    address: buildPostalAddress(site),
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
  };
}

function buildOffer({
  price,
  currency,
  url,
  name,
}: {
  price: number | null;
  currency: string;
  url: string;
  name?: string;
}) {
  if (price == null) return undefined;

  return {
    "@type": "Offer",
    ...(name && { name }),
    price,
    priceCurrency: currency,
    url,
    availability: "https://schema.org/InStock",
  };
}

function buildServiceForClass(
  entry: ClassKnowledge,
  site: SiteKnowledge,
): Record<string, unknown> {
  return {
    "@type": "Service",
    "@id": `${entry.url}#service`,
    name: `${entry.name} at ${site.name}`,
    serviceType: entry.tagline || "Pole and exotic dance class",
    description: entry.summary,
    provider: {
      "@type": "DanceSchool",
      name: site.name,
      url: site.url,
    },
    areaServed: {
      "@type": "City",
      name: site.address.city,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Beginner to advanced adults",
    },
    offers: buildOffer({
      price: entry.currentPrice,
      currency: entry.priceCurrency,
      url: entry.bookingUrl,
      name: `${entry.name} booking`,
    }),
    ...(entry.imageUrl && { image: entry.imageUrl }),
    url: entry.url,
  };
}

function buildClassEventGraph(
  entry: ClassKnowledge,
  site: SiteKnowledge,
): Record<string, unknown>[] {
  return entry.schedule.map((slot, index) => ({
    "@type": "EducationEvent",
    "@id": `${entry.url}#event-${index + 1}`,
    name: `${entry.name} - ${slot.day} ${slot.time}`,
    description: `${entry.name} at ${site.name} in ${site.address.city}. ${
      entry.summary
    }`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: buildPlace(site),
    organizer: {
      "@type": "DanceSchool",
      name: site.name,
      url: site.url,
    },
    isAccessibleForFree: false,
    ...(slot.nextOccurrenceIso && { startDate: slot.nextOccurrenceIso }),
    ...(slot.endTime24 && slot.nextOccurrenceIso
      ? {
          endDate: slot.nextOccurrenceIso.replace(
            /T\d{2}:\d{2}:00/,
            `T${slot.endTime24}:00`,
          ),
        }
      : {}),
    ...(slot.startTime24 && {
      eventSchedule: {
        "@type": "Schedule",
        byDay: SCHEMA_DAY_MAP[slot.day],
        startTime: slot.startTime24,
        ...(slot.endTime24 && { endTime: slot.endTime24 }),
        repeatFrequency: "P1W",
        scheduleTimezone: "Africa/Johannesburg",
      },
    }),
    offers: buildOffer({
      price: entry.currentPrice,
      currency: entry.priceCurrency,
      url: entry.bookingUrl,
      name: `${entry.name} booking`,
    }),
    url: entry.url,
  }));
}

function buildClassListItem(entry: ClassKnowledge, position: number) {
  return {
    "@type": "ListItem",
    position,
    url: entry.url,
    item: {
      "@type": "Service",
      name: entry.name,
      description: entry.summary,
      ...(entry.imageUrl && { image: entry.imageUrl }),
      offers: buildOffer({
        price: entry.currentPrice,
        currency: entry.priceCurrency,
        url: entry.bookingUrl,
      }),
    },
  };
}

function buildBundleOffer(bundle: BundleKnowledge) {
  return {
    "@type": "Offer",
    name: bundle.name,
    description: bundle.note || bundle.tagline || undefined,
    url: bundle.url,
    price: bundle.currentPrice,
    priceCurrency: bundle.priceCurrency,
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Service",
      name: bundle.name,
      serviceType:
        bundle.category === "private"
          ? "Private dance class bundle"
          : "Group dance class bundle",
    },
  };
}

export function buildDanceSchoolJsonLd(knowledge: KnowledgeBase): Record<string, unknown> {
  const { site, classes, bundles } = knowledge;
  const currentPrices = [...classes, ...bundles]
    .map((entry) => entry.currentPrice)
    .filter((value): value is number => typeof value === "number" && value > 0);
  const minPrice = currentPrices.length ? Math.min(...currentPrices) : null;
  const maxPrice = currentPrices.length ? Math.max(...currentPrices) : null;

  return {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    name: site.name,
    description: `${site.tagline} in Woodstock, ${site.address.city}. Group and private classes for all levels.`,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: buildPostalAddress(site),
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    ...(minPrice && maxPrice && {
      priceRange:
        minPrice === maxPrice ? `R${minPrice}` : `R${minPrice} - R${maxPrice}`,
    }),
    currenciesAccepted: "ZAR",
    sameAs: [site.instagramUrl, site.instructorInstagramUrl].filter(Boolean),
    ...(site.logoUrl && {
      image: site.logoUrl,
      logo: site.logoUrl,
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "C4 Flow classes and pricing",
      itemListElement: [
        ...classes.map((entry) => ({
          "@type": "Offer",
          name: entry.name,
          description: entry.summary,
          url: entry.url,
          ...(entry.currentPrice && {
            price: entry.currentPrice,
            priceCurrency: entry.priceCurrency,
          }),
          itemOffered: {
            "@type": "Service",
            name: entry.name,
            serviceType: entry.tagline || "Dance class",
          },
        })),
        ...bundles.map(buildBundleOffer),
      ],
    },
  };
}

export function buildCatalogPageJsonLd({
  pageUrl,
  pageTitle,
  pageDescription,
  classes,
  bundles = [],
}: {
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  classes: ClassKnowledge[];
  bundles?: BundleKnowledge[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#classes`,
        name: "C4 Flow class list",
        itemListElement: classes.map((entry, index) =>
          buildClassListItem(entry, index + 1),
        ),
      },
      ...(bundles.length
        ? [
            {
              "@type": "OfferCatalog",
              "@id": `${pageUrl}#pricing`,
              name: "C4 Flow pricing",
              itemListElement: bundles.map(buildBundleOffer),
            },
          ]
        : []),
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildClassPageJsonLd(
  entry: ClassKnowledge,
  site: SiteKnowledge,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${entry.url}#webpage`,
        url: entry.url,
        name: `${entry.name} | ${site.name}`,
        description: entry.summary,
        isPartOf: {
          "@type": "WebSite",
          name: site.name,
          url: site.url,
        },
      },
      buildServiceForClass(entry, site),
      ...buildClassEventGraph(entry, site),
    ],
  };
}
