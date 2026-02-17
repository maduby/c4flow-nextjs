"use client";

import Image from "next/image";
import { Clock, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { formatCurrency } from "@/lib/utils";
import { BookNowLink } from "@/components/ui/BookNowLink";

interface ScheduleEntry {
  _key: string;
  day: string;
  time: string;
}

interface DanceClass {
  _id: string;
  name: string | null;
  slug: string | null;
  shortDescription: string | null;
  image: { asset?: { _ref: string }; alt?: string } | null;
  price: number | null;
  salePrice: number | null;
  duration: number | null;
  schedule: ScheduleEntry[] | null;
  bookingUrl: string | null;
}

interface ClassCardProps {
  danceClass: DanceClass;
  /** Percentage discount from the banner promo (e.g. 25 for 25% off) */
  bannerDiscount?: number | null;
}

export function ClassCard({ danceClass, bannerDiscount }: ClassCardProps) {
  const {
    name,
    shortDescription,
    image,
    price,
    salePrice,
    duration,
    schedule,
    bookingUrl,
  } = danceClass;

  const originalPrice = price || 0;

  const effectiveSalePrice = bannerDiscount
    ? Math.floor(originalPrice * (1 - bannerDiscount / 100))
    : salePrice;

  const hasDiscount = effectiveSalePrice && effectiveSalePrice < originalPrice;

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
            src={urlFor(image).width(600).height(450).quality(80).url()}
            alt={name || "Dance class"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Price badge */}
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold backdrop-blur-sm">
            {hasDiscount ? (
              <>
                <span className="text-pink-500">
                  {formatCurrency(effectiveSalePrice)}
                </span>
                <span className="ml-1 text-xs text-neutral-400 line-through">
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
          {bannerDiscount && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              <Tag size={10} />
              {bannerDiscount}% OFF
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-neutral-800">{name}</h3>
        {shortDescription && (
          <p className="mb-4 text-sm text-neutral-400 line-clamp-3">
            {shortDescription}
          </p>
        )}

        {/* Meta */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-neutral-400">
          {duration && (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {duration} min
            </span>
          )}
          {schedule && schedule.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />
              {schedule.map((s) => s.day).join(", ")}
            </span>
          )}
        </div>

        {/* Book button */}
        {bookingUrl && (
          <BookNowLink
            href={bookingUrl}
            label={name || "class"}
            source="class_card"
            className="block w-full rounded-full bg-pink-500 py-2.5 text-center text-sm font-medium text-white hover:bg-pink-600"
          />
        )}
      </div>
    </motion.article>
  );
}
