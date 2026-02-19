"use client";

import Image from "next/image";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { urlFor, blurProps } from "@/sanity/lib/image";
import { formatCurrency } from "@/lib/utils";
import { BookNowLink } from "@/components/ui/BookNowLink";
import { SITE_CONFIG } from "@/lib/constants";

interface DanceClass {
  _id: string;
  name: string | null;
  slug: string | null;
  shortDescription: string | null;
  tagline: string | null;
  days: string | null;
  image: { asset?: { _ref: string }; alt?: string; lqip?: string | null } | null;
  price: number | null;
  salePrice: number | null;
  duration: number | null;
  bookingUrl: string | null;
}

interface ClassCardProps {
  danceClass: DanceClass;
  /** Percentage discount from the banner promo (e.g. 25 for 25% off) */
  bannerDiscount?: number | null;
  /** Full href for the "Learn More" link (e.g. "/classes#class-details") */
  detailsHref?: string;
  /** Days derived from the weekly schedule (overrides danceClass.days) */
  scheduleDays?: string | null;
}

export function ClassCard({ danceClass, bannerDiscount, detailsHref, scheduleDays }: ClassCardProps) {
  const {
    name,
    tagline,
    days,
    image,
    price,
    salePrice,
    duration,
    bookingUrl,
  } = danceClass;

  const originalPrice = price || 0;

  const classHasSale = salePrice && salePrice < originalPrice;
  const effectiveSalePrice = classHasSale
    ? salePrice
    : bannerDiscount
      ? Math.floor(originalPrice * (1 - bannerDiscount / 100))
      : null;

  const hasDiscount = effectiveSalePrice && effectiveSalePrice < originalPrice;
  const showBannerBadge = bannerDiscount && !classHasSale;

  const resolvedBookingUrl = bookingUrl || SITE_CONFIG.booking.url;

  const displayDays = scheduleDays || days;

  const meta = [
    duration ? `${duration} min` : null,
    displayDays || null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-card"
      whileHover={{
        y: -4,
        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {/* Image */}
      {image?.asset && (
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={urlFor(image).width(400).height(300).quality(80).url()}
            alt={name || "Dance class"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            {...blurProps(image.lqip)}
          />
          {/* Price badge */}
          <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
            {hasDiscount ? (
              <>
                <span className="text-pink-500">
                  {formatCurrency(effectiveSalePrice)}
                </span>
                <span className="ml-1 text-[10px] text-neutral-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-primary-600">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Tag size={9} />
              {showBannerBadge ? `${bannerDiscount}% OFF` : "SALE"}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg text-neutral-800">{name}</h3>

        {meta && (
          <p className="mt-1 text-xs text-neutral-400">{meta}</p>
        )}

        {tagline && (
          <p className="mt-1 text-xs text-neutral-500">{tagline}</p>
        )}

        {/* Buttons */}
        <div className="mt-3 flex gap-2">
          <BookNowLink
            href={resolvedBookingUrl}
            label={name || "class"}
            source="class_card"
            className="rounded-full border border-neutral-800 bg-neutral-800 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
          />
          {detailsHref && (
            <a
              href={detailsHref}
              className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
            >
              Learn More
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
