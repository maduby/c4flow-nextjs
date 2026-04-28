import { getSiteOriginForMetadata } from "@/lib/site-origin";
import { SITE_CONFIG } from "@/lib/constants";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

const SITE_ORIGIN = getSiteOriginForMetadata();
const ZA_OFFSET = "+02:00";
const ZA_OFFSET_MS = 2 * 60 * 60 * 1000;

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export interface SiteKnowledge {
  name: string;
  tagline: string;
  motto: string | null;
  url: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  bookingUrl: string;
  instagramUrl: string | null;
  instructorInstagramUrl: string | null;
  mapsUrl: string | null;
  logoUrl: string | null;
  defaultOgImageUrl: string | null;
  primaryInstructor: {
    name: string;
    title: string | null;
    instagramUrl: string | null;
    photoUrl: string | null;
  } | null;
  address: {
    building: string | null;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
}

export interface PageKnowledge {
  title: string;
  slug: string;
  url: string;
  description: string | null;
  sectionTypes: string[];
}

export interface ScheduleEntry {
  day: string;
  time: string;
  startTime24: string | null;
  endTime24: string | null;
  nextOccurrenceIso: string | null;
  bookingUrl: string;
}

export interface ClassKnowledge {
  id: string;
  name: string;
  slug: string;
  url: string;
  shortDescription: string | null;
  descriptionText: string | null;
  descriptionBlocks: Array<Record<string, unknown>> | null;
  summary: string;
  tagline: string | null;
  category: string | null;
  days: string | null;
  daysSummary: string | null;
  durationMinutes: number | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageLqip: string | null;
  bookingUrl: string;
  priceCurrency: "ZAR";
  offerValidFrom: string;
  listPrice: number | null;
  currentPrice: number | null;
  salePrice: number | null;
  hasDiscount: boolean;
  discountLabel: string | null;
  schedule: ScheduleEntry[];
}

export interface BundleKnowledge {
  id: string;
  name: string;
  category: string;
  tagline: string | null;
  note: string | null;
  highlighted: boolean;
  url: string;
  priceCurrency: "ZAR";
  listPrice: number;
  currentPrice: number;
  salePrice: number | null;
  hasDiscount: boolean;
  discountLabel: string | null;
}

export interface KnowledgeBase {
  generatedAt: string;
  site: SiteKnowledge;
  pages: PageKnowledge[];
  classes: ClassKnowledge[];
  bundles: BundleKnowledge[];
  scheduleByDay: Array<{
    day: string;
    slots: Array<
      ScheduleEntry & {
        classId: string;
        className: string;
        classSlug: string;
        classUrl: string;
        currentPrice: number | null;
        listPrice: number | null;
        durationMinutes: number | null;
      }
    >;
  }>;
}

interface RawSettings {
  siteName?: string | null;
  tagline?: string | null;
  motto?: string | null;
  logo?: { asset?: { _ref?: string } } | null;
  contactEmail?: string | null;
  phone?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
  address?: {
    building?: string | null;
    street?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
  } | null;
  instagramUrl?: string | null;
  instructorInstagramUrl?: string | null;
  bookingUrl?: string | null;
  mapsUrl?: string | null;
  defaultOgImage?: { asset?: { _ref?: string } } | null;
}

interface RawPage {
  title?: string | null;
  slug?: string | null;
  seoDescription?: string | null;
  sections?: Array<{ _type?: string | null }> | null;
}

interface RawBlockChild {
  text?: string | null;
}

interface RawBlock {
  _type?: string | null;
  children?: RawBlockChild[] | null;
}

interface RawClass {
  _id: string;
  _updatedAt?: string | null;
  name?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  description?: RawBlock[] | null;
  tagline?: string | null;
  days?: string | null;
  category?: string | null;
  image?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
    lqip?: string | null;
  } | null;
  price?: number | null;
  salePrice?: number | null;
  duration?: number | null;
  bookingUrl?: string | null;
}

interface RawInstructor {
  name?: string | null;
  title?: string | null;
  instagramUrl?: string | null;
  photo?: {
    asset?: { _ref?: string } | null;
  } | null;
}

interface RawDiscount {
  enabled?: boolean | null;
  discountPercent?: number | null;
  discountScope?: string | null;
  discountClassIds?: string[] | null;
  applyToGroupBundles?: boolean | null;
  applyToPrivateBundles?: boolean | null;
}

interface RawBundle {
  _id: string;
  name?: string | null;
  category?: string | null;
  tagline?: string | null;
  price?: number | null;
  salePrice?: number | null;
  note?: string | null;
  highlighted?: boolean | null;
}

interface RawScheduleSlot {
  _key: string;
  day?: string | null;
  time?: string | null;
  classId?: string | null;
  className?: string | null;
}

function stripWhitespace(value: string | null | undefined): string | null {
  const clean = value?.replace(/\s+/g, " ").trim();
  return clean || null;
}

function blocksToPlainText(blocks: RawBlock[] | null | undefined): string | null {
  const text = (blocks || [])
    .filter((block) => block?._type === "block")
    .map((block) =>
      (block.children || [])
        .map((child) => child.text || "")
        .join("")
        .trim(),
    )
    .filter(Boolean)
    .join("\n\n");

  return stripWhitespace(text);
}

function buildPageUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function classPath(slug: string): string {
  return `/classes/${slug}`;
}

function parseTimeLabelTo24Hour(label: string | null | undefined): string | null {
  if (!label) return null;

  const match = label.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] || "0");
  const suffix = match[3].toUpperCase();

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  if (suffix === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function addMinutes(time24: string | null, durationMinutes: number | null): string | null {
  if (!time24 || !durationMinutes) return null;

  const [hour, minute] = time24.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  const totalMinutes = (hour * 60 + minute + durationMinutes) % (24 * 60);
  const nextHour = Math.floor(totalMinutes / 60);
  const nextMinute = totalMinutes % 60;

  return `${nextHour.toString().padStart(2, "0")}:${nextMinute
    .toString()
    .padStart(2, "0")}`;
}

function formatLocalIso(dayOffset: number, time24: string): string | null {
  const [hour, minute] = time24.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  const zaNow = new Date(Date.now() + ZA_OFFSET_MS);
  const target = new Date(
    Date.UTC(
      zaNow.getUTCFullYear(),
      zaNow.getUTCMonth(),
      zaNow.getUTCDate() + dayOffset,
      hour,
      minute,
      0,
    ),
  );

  const year = target.getUTCFullYear();
  const month = `${target.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${target.getUTCDate()}`.padStart(2, "0");
  const targetHour = `${target.getUTCHours()}`.padStart(2, "0");
  const targetMinute = `${target.getUTCMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${targetHour}:${targetMinute}:00${ZA_OFFSET}`;
}

function getNextOccurrenceIso(day: string, time24: string | null): string | null {
  if (!time24 || !(day in DAY_INDEX)) return null;

  const zaNow = new Date(Date.now() + ZA_OFFSET_MS);
  const targetDay = DAY_INDEX[day];
  const currentDay = zaNow.getUTCDay();
  const currentMinutes = zaNow.getUTCHours() * 60 + zaNow.getUTCMinutes();
  const [targetHour, targetMinute] = time24.split(":").map(Number);
  const targetMinutes = targetHour * 60 + targetMinute;

  let dayOffset = (targetDay - currentDay + 7) % 7;
  if (dayOffset === 0 && targetMinutes <= currentMinutes) {
    dayOffset = 7;
  }

  return formatLocalIso(dayOffset, time24);
}

function timeSortValue(label: string): number {
  const time24 = parseTimeLabelTo24Hour(label);
  if (!time24) return Number.MAX_SAFE_INTEGER;
  const [hour, minute] = time24.split(":").map(Number);
  return hour * 60 + minute;
}

function getClassDiscount(
  classId: string,
  discountDoc: RawDiscount | null,
): number | null {
  if (!discountDoc?.enabled || !discountDoc.discountPercent) return null;
  if (discountDoc.discountScope === "all") return discountDoc.discountPercent;
  if (
    discountDoc.discountScope === "specific" &&
    discountDoc.discountClassIds?.includes(classId)
  ) {
    return discountDoc.discountPercent;
  }
  return null;
}

function getBundleDiscount(
  category: string | null | undefined,
  discountDoc: RawDiscount | null,
): number | null {
  if (!discountDoc?.enabled || !discountDoc.discountPercent) return null;
  if (category === "group" && discountDoc.applyToGroupBundles) {
    return discountDoc.discountPercent;
  }
  if (category === "private" && discountDoc.applyToPrivateBundles) {
    return discountDoc.discountPercent;
  }
  return null;
}

function buildDaysSummary(schedule: ScheduleEntry[]): string | null {
  if (!schedule.length) return null;

  const uniqueDays = DAY_ORDER.filter((day) =>
    schedule.some((entry) => entry.day === day),
  );
  const labels = uniqueDays.map((day) => DAY_SHORT[day] || day);

  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} & ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} & ${labels[labels.length - 1]}`;
}

async function fetchPublishedKnowledgeSource() {
  return client.fetch<{
    settings: RawSettings | null;
    primaryInstructor: RawInstructor | null;
    pages: RawPage[];
    classes: RawClass[];
    discount: RawDiscount | null;
    bundles: RawBundle[];
    schedule: { slots?: RawScheduleSlot[] | null } | null;
  }>(`{
    "settings": *[_type == "siteSettings"][0]{
      siteName,
      tagline,
      motto,
      logo,
      contactEmail,
      phone,
      whatsappNumber,
      whatsappMessage,
      address,
      instagramUrl,
      instructorInstagramUrl,
      bookingUrl,
      mapsUrl,
      defaultOgImage
    },
    "primaryInstructor": *[_type == "instructor"] | order(_updatedAt desc, _createdAt desc)[0]{
      name,
      title,
      instagramUrl,
      photo
    },
    "pages": *[_type == "page" && defined(slug.current)] | order(title asc){
      title,
      "slug": slug.current,
      seoDescription,
      sections[]{
        _type
      }
    },
    "classes": *[_type == "danceClass" && active != false] | order(order asc, name asc){
      _id,
      _updatedAt,
      name,
      "slug": slug.current,
      shortDescription,
      description,
      tagline,
      days,
      category,
      image{
        ...,
        "lqip": asset->metadata.lqip
      },
      price,
      salePrice,
      duration,
      bookingUrl
    },
    "discount": *[_type == "discount"][0]{
      enabled,
      discountPercent,
      discountScope,
      "discountClassIds": discountClasses[]->_id,
      applyToGroupBundles,
      applyToPrivateBundles
    },
    "bundles": *[_type == "pricingBundle"] | order(category asc, order asc, name asc){
      _id,
      name,
      category,
      tagline,
      price,
      salePrice,
      note,
      highlighted
    },
    "schedule": *[_type == "weeklySchedule"][0]{
      slots[danceClass->active != false]{
        _key,
        day,
        time,
        "classId": danceClass->_id,
        "className": danceClass->name
      }
    }
  }`);
}

export async function getKnowledgeBase(): Promise<KnowledgeBase> {
  const source = await fetchPublishedKnowledgeSource();
  const generatedAt = new Date().toISOString();

  const site: SiteKnowledge = {
    name: source.settings?.siteName || SITE_CONFIG.name,
    tagline: source.settings?.tagline || SITE_CONFIG.tagline,
    motto: source.settings?.motto || SITE_CONFIG.motto,
    url: SITE_ORIGIN,
    email: source.settings?.contactEmail || SITE_CONFIG.email,
    phone: source.settings?.phone || SITE_CONFIG.phone,
    whatsappNumber:
      source.settings?.whatsappNumber || SITE_CONFIG.whatsapp.number,
    whatsappMessage:
      source.settings?.whatsappMessage || SITE_CONFIG.whatsapp.message,
    bookingUrl: source.settings?.bookingUrl || SITE_CONFIG.booking.url,
    instagramUrl:
      source.settings?.instagramUrl || SITE_CONFIG.social.instagram,
    instructorInstagramUrl:
      source.settings?.instructorInstagramUrl ||
      SITE_CONFIG.social.instructorInstagram,
    mapsUrl: source.settings?.mapsUrl || SITE_CONFIG.maps.url,
    logoUrl:
      source.settings?.logo?.asset
        ? urlFor(source.settings.logo).width(320).url()
        : null,
    defaultOgImageUrl:
      source.settings?.defaultOgImage?.asset
        ? urlFor(source.settings.defaultOgImage).width(1200).height(630).url()
        : null,
    primaryInstructor: source.primaryInstructor?.name
      ? {
          name: source.primaryInstructor.name,
          title: stripWhitespace(source.primaryInstructor.title),
          instagramUrl: stripWhitespace(source.primaryInstructor.instagramUrl),
          photoUrl:
            source.primaryInstructor.photo?.asset
              ? urlFor(source.primaryInstructor.photo).width(1200).height(1600).url()
              : null,
        }
      : null,
    address: {
      building: source.settings?.address?.building || SITE_CONFIG.address.building,
      street: source.settings?.address?.street || SITE_CONFIG.address.street,
      city: source.settings?.address?.city || SITE_CONFIG.address.city,
      province:
        source.settings?.address?.province || SITE_CONFIG.address.province,
      postalCode:
        source.settings?.address?.postalCode || SITE_CONFIG.address.postalCode,
      country: SITE_CONFIG.address.country,
    },
    geo: {
      latitude: SITE_CONFIG.maps.lat,
      longitude: SITE_CONFIG.maps.lng,
    },
  };

  const pages: PageKnowledge[] = (source.pages || []).map((page) => ({
    title: page.slug === "home" ? site.name : page.title || page.slug || site.name,
    slug: page.slug || "home",
    url: page.slug === "home" ? site.url : buildPageUrl(`/${page.slug}`),
    description: stripWhitespace(page.seoDescription),
    sectionTypes: (page.sections || [])
      .map((section) => section?._type || "")
      .filter(Boolean),
  }));

  const scheduleSlotsByClass = new Map<string, ScheduleEntry[]>();
  for (const slot of source.schedule?.slots || []) {
    if (!slot.classId || !slot.day || !slot.time) continue;
    const startTime24 = parseTimeLabelTo24Hour(slot.time);
    const baseEntry: ScheduleEntry = {
      day: slot.day,
      time: slot.time,
      startTime24,
      endTime24: null,
      nextOccurrenceIso: getNextOccurrenceIso(slot.day, startTime24),
      bookingUrl: site.bookingUrl,
    };
    const current = scheduleSlotsByClass.get(slot.classId) || [];
    current.push(baseEntry);
    scheduleSlotsByClass.set(slot.classId, current);
  }

  const classes: ClassKnowledge[] = (source.classes || []).flatMap((rawClass) => {
    const slug = stripWhitespace(rawClass.slug);
    const name = stripWhitespace(rawClass.name);

    if (!slug || !name) return [];

    const listPrice = rawClass.price ?? null;
    const manualSalePrice =
      rawClass.salePrice && listPrice && rawClass.salePrice < listPrice
        ? rawClass.salePrice
        : null;
    const discountPercent = getClassDiscount(rawClass._id, source.discount);
    const discountPrice =
      discountPercent && listPrice
        ? Math.floor(listPrice * (1 - discountPercent / 100))
        : null;
    const currentPrice =
      manualSalePrice ??
      (discountPrice && listPrice && discountPrice < listPrice
        ? discountPrice
        : listPrice);
    const hasDiscount =
      !!listPrice && !!currentPrice && currentPrice < listPrice;
    const schedule = (scheduleSlotsByClass.get(rawClass._id) || [])
      .map((slot) => ({
        ...slot,
        endTime24: addMinutes(slot.startTime24, rawClass.duration ?? null),
        bookingUrl: rawClass.bookingUrl || site.bookingUrl,
      }))
      .sort((a, b) => {
        const dayDelta = DAY_ORDER.indexOf(a.day as (typeof DAY_ORDER)[number]) -
          DAY_ORDER.indexOf(b.day as (typeof DAY_ORDER)[number]);
        if (dayDelta !== 0) return dayDelta;
        return timeSortValue(a.time) - timeSortValue(b.time);
      });

    return [
      {
        id: rawClass._id,
        name,
        slug,
        url: buildPageUrl(classPath(slug)),
        shortDescription: stripWhitespace(rawClass.shortDescription),
        descriptionText: blocksToPlainText(rawClass.description),
        descriptionBlocks:
          rawClass.description?.map((block) => ({ ...block })) || null,
        summary:
          stripWhitespace(rawClass.shortDescription) ||
          blocksToPlainText(rawClass.description) ||
          `${name} at ${site.name}.`,
        tagline: stripWhitespace(rawClass.tagline),
        category: stripWhitespace(rawClass.category),
        days: stripWhitespace(rawClass.days),
        daysSummary:
          buildDaysSummary(schedule) || stripWhitespace(rawClass.days),
        durationMinutes: rawClass.duration ?? null,
        imageUrl:
          rawClass.image?.asset
            ? urlFor(rawClass.image).width(1200).height(900).quality(85).url()
            : null,
        imageAlt: stripWhitespace(rawClass.image?.alt) || name,
        imageLqip: rawClass.image?.lqip || null,
        bookingUrl: rawClass.bookingUrl || site.bookingUrl,
        priceCurrency: "ZAR",
        offerValidFrom: generatedAt,
        listPrice,
        currentPrice,
        salePrice: manualSalePrice,
        hasDiscount,
        discountLabel: hasDiscount
          ? manualSalePrice
            ? "Sale price"
            : discountPercent
              ? `${discountPercent}% off`
              : "Discounted"
          : null,
        schedule,
      },
    ];
  });

  const bundles: BundleKnowledge[] = (source.bundles || []).flatMap((bundle) => {
    const name = stripWhitespace(bundle.name);
    const category = stripWhitespace(bundle.category);
    const listPrice = bundle.price ?? null;
    if (!name || !category || !listPrice) return [];

    const manualSalePrice =
      bundle.salePrice && bundle.salePrice < listPrice ? bundle.salePrice : null;
    const discountPercent = getBundleDiscount(category, source.discount);
    const discountPrice =
      discountPercent != null
        ? Math.floor(listPrice * (1 - discountPercent / 100))
        : null;
    const currentPrice =
      manualSalePrice != null && discountPrice != null
        ? Math.min(manualSalePrice, discountPrice)
        : manualSalePrice ?? discountPrice ?? listPrice;
    const hasDiscount = currentPrice < listPrice;

    return [
      {
        id: bundle._id,
        name,
        category,
        tagline: stripWhitespace(bundle.tagline),
        note: stripWhitespace(bundle.note),
        highlighted: !!bundle.highlighted,
        url: buildPageUrl("/classes"),
        priceCurrency: "ZAR",
        listPrice,
        currentPrice,
        salePrice: manualSalePrice,
        hasDiscount,
        discountLabel: hasDiscount
          ? manualSalePrice
            ? "Sale price"
            : discountPercent
              ? `${discountPercent}% off`
              : "Discounted"
          : null,
      },
    ];
  });

  const scheduleByDay = DAY_ORDER.map((day) => {
    const slots = classes
      .flatMap((entry) =>
        entry.schedule
          .filter((slot) => slot.day === day)
          .map((slot) => ({
            ...slot,
            classId: entry.id,
            className: entry.name,
            classSlug: entry.slug,
            classUrl: entry.url,
            currentPrice: entry.currentPrice,
            listPrice: entry.listPrice,
            durationMinutes: entry.durationMinutes,
          })),
      )
      .sort((a, b) => timeSortValue(a.time) - timeSortValue(b.time));

    return {
      day,
      slots,
    };
  }).filter((day) => day.slots.length > 0);

  return {
    generatedAt,
    site,
    pages,
    classes,
    bundles,
    scheduleByDay,
  };
}

export async function getClassBySlug(slug: string): Promise<ClassKnowledge | null> {
  const knowledgeBase = await getKnowledgeBase();
  return knowledgeBase.classes.find((entry) => entry.slug === slug) || null;
}
