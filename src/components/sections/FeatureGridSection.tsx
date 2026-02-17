"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface Feature {
  _key: string;
  title: string;
  description: string;
  icon?: { asset?: { _ref: string } } | null;
}

interface FeatureGridSectionProps {
  heading?: string | null;
  subtitle?: string | null;
  features?: Feature[] | null;
}

const CARD_STYLES = [
  {
    borderRadius: "36px 14px 30px 14px",
    bg: "linear-gradient(135deg, #ebe4ff 0%, #ffe8ef 50%, #ebe4ff 100%)",
    iconBg: "linear-gradient(135deg, #673de6 0%, #fc5185 100%)",
    blobBg:
      "linear-gradient(135deg, rgba(103,61,230,0.25) 0%, rgba(252,81,133,0.18) 100%)",
    blobRadius: "60% 40% 50% 50% / 55% 45% 55% 45%",
  },
  {
    borderRadius: "14px 36px 14px 30px",
    bg: "linear-gradient(135deg, #ffe8ef 0%, #fff8e2 50%, #ffe8ef 100%)",
    iconBg: "linear-gradient(135deg, #fc5185 0%, #fea419 100%)",
    blobBg:
      "linear-gradient(135deg, rgba(252,81,133,0.22) 0%, rgba(254,164,25,0.15) 100%)",
    blobRadius: "45% 55% 40% 60% / 50% 50% 55% 45%",
  },
  {
    borderRadius: "30px 14px 14px 36px",
    bg: "linear-gradient(135deg, #d5dfff 0%, #ebe4ff 50%, #d5dfff 100%)",
    iconBg: "linear-gradient(135deg, #5025d1 0%, #8c85ff 100%)",
    blobBg:
      "linear-gradient(135deg, rgba(80,37,209,0.2) 0%, rgba(179,158,243,0.18) 100%)",
    blobRadius: "50% 50% 60% 40% / 40% 60% 45% 55%",
  },
  {
    borderRadius: "14px 30px 36px 14px",
    bg: "linear-gradient(135deg, #ffe8ef 0%, #def4f0 50%, #ffe8ef 100%)",
    iconBg: "linear-gradient(135deg, #fc5185 0%, #00b090 100%)",
    blobBg:
      "linear-gradient(135deg, rgba(252,81,133,0.2) 0%, rgba(0,176,144,0.15) 100%)",
    blobRadius: "55% 45% 45% 55% / 60% 40% 50% 50%",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeatureGridSection({
  heading,
  subtitle,
  features,
}: FeatureGridSectionProps) {
  if (!features?.length) return null;

  const count = features.length;
  const gridCols =
    count === 1
      ? "max-w-md mx-auto"
      : count === 2
        ? "sm:grid-cols-2 max-w-2xl mx-auto"
        : count === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : `sm:grid-cols-2 lg:grid-cols-${Math.min(count, 3)}`;

  return (
    <section className="relative overflow-hidden py-12 md:py-24">
      {/* Large ambient background glow */}
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2"
        style={{
          borderRadius: "50% 50% 40% 60% / 60% 40% 55% 45%",
          background:
            "radial-gradient(ellipse at 35% 45%, rgba(103,61,230,0.1) 0%, rgba(252,81,133,0.08) 45%, transparent 70%)",
          filter: "blur(50px)",
        }}
        aria-hidden="true"
      />

      <Container>
        {heading && (
          <SectionHeading subtitle={subtitle}>{heading}</SectionHeading>
        )}

        <motion.div
          className={`grid items-start gap-7 ${gridCols}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, i) => {
            const s = CARD_STYLES[i % CARD_STYLES.length];

            return (
              <motion.div
                key={feature._key}
                className="feature-card group relative overflow-hidden p-8 shadow-md"
                style={{
                  borderRadius: s.borderRadius,
                  backgroundImage: s.bg,
                  backgroundSize: "200% 200%",
                }}
                variants={cardVariants}
              >
                {/* Decorative blob top-left */}
                <div
                  className="absolute -left-6 -top-6 h-32 w-32 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    borderRadius: s.blobRadius,
                    background: s.blobBg,
                    filter: "blur(18px)",
                  }}
                  aria-hidden="true"
                />

                {/* Content */}
                <div className="relative z-10">
                  {feature.icon?.asset && (
                    <div
                      className="mb-6 inline-flex h-16 w-16 items-center justify-center shadow-lg"
                      style={{
                        borderRadius: s.blobRadius,
                        background: s.iconBg,
                      }}
                    >
                      <Image
                        src={urlFor(feature.icon).width(64).height(64).url()}
                        alt=""
                        width={34}
                        height={34}
                        className="brightness-0 invert drop-shadow-md"
                      />
                    </div>
                  )}

                  <h3 className="mb-2 font-heading text-2xl text-primary-700">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
