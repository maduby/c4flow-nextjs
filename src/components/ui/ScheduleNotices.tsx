"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ScheduleNotice {
  _key: string;
  style: string | null;
  emoji: string | null;
  title: string | null;
  body: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  startDate: string | null;
  endDate: string | null;
}

interface ScheduleNoticesProps {
  notices: ScheduleNotice[];
}

const STYLE_CONFIG: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    accent: string;
    btnBg: string;
    btnText: string;
    defaultEmoji: string;
    glow: string;
  }
> = {
  celebration: {
    bg: "bg-gradient-to-r from-pink-50 via-primary-50 to-pink-50",
    border: "border-pink-200",
    text: "text-primary-700",
    accent: "text-pink-600",
    btnBg: "bg-pink-500 hover:bg-pink-600",
    btnText: "text-white",
    defaultEmoji: "🎉",
    glow: "from-pink-200/40 to-primary-200/40",
  },
  info: {
    bg: "bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50",
    border: "border-primary-200",
    text: "text-primary-700",
    accent: "text-primary-500",
    btnBg: "bg-primary-500 hover:bg-primary-600",
    btnText: "text-white",
    defaultEmoji: "ℹ️",
    glow: "from-primary-200/40 to-blue-200/40",
  },
  warning: {
    bg: "bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    accent: "text-orange-500",
    btnBg: "bg-orange-500 hover:bg-orange-600",
    btnText: "text-white",
    defaultEmoji: "⚠️",
    glow: "from-orange-200/40 to-amber-200/40",
  },
  new: {
    bg: "bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50",
    border: "border-teal-500/30",
    text: "text-teal-600",
    accent: "text-teal-500",
    btnBg: "bg-teal-500 hover:bg-teal-600",
    btnText: "text-white",
    defaultEmoji: "🆕",
    glow: "from-teal-200/40 to-emerald-200/40",
  },
};

function isInDateRange(
  startDate: string | null,
  endDate: string | null
): boolean {
  const today = new Date().toISOString().split("T")[0];
  if (startDate && today < startDate) return false;
  if (endDate && today > endDate) return false;
  return true;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function ScheduleNotices({ notices }: ScheduleNoticesProps) {
  const visible = notices.filter((n) => isInDateRange(n.startDate, n.endDate));

  if (!visible.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="mx-auto mb-10 max-w-3xl space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="region"
        aria-label="Schedule announcements"
      >
        {visible.map((notice) => {
          const style = STYLE_CONFIG[notice.style || "info"] || STYLE_CONFIG.info;
          const emoji = notice.emoji || style.defaultEmoji;

          return (
            <motion.div
              key={notice._key}
              variants={cardVariants}
              className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} px-5 py-4 shadow-sm md:px-6 md:py-5`}
            >
              {/* Decorative glow */}
              <div
                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br ${style.glow} blur-2xl`}
                aria-hidden="true"
              />
              <div
                className={`absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-linear-to-tr ${style.glow} blur-xl`}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-base font-semibold leading-snug ${style.text} md:text-lg`}
                  >
                    <span className="mr-1.5" aria-hidden="true">
                      {emoji}
                    </span>
                    {notice.title}
                  </p>
                  {notice.body && (
                    <p
                      className={`mt-1 text-sm leading-relaxed ${style.accent} opacity-80`}
                    >
                      {notice.body}
                    </p>
                  )}
                </div>

                {notice.linkUrl && (
                  <a
                    href={notice.linkUrl}
                    target={
                      notice.linkUrl.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      notice.linkUrl.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors ${style.btnBg} ${style.btnText}`}
                  >
                    {notice.linkLabel || "Learn More"}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
