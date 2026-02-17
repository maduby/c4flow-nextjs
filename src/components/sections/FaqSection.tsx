"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

interface Faq {
  _key: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  heading?: string | null;
  faqs?: Faq[] | null;
}

export function FaqSection({ heading, faqs }: FaqSectionProps) {
  if (!faqs?.length) return null;

  return (
    <section id="faqs" className="py-12 md:py-24">
      <Container>
        <SectionHeading>
          {heading || "Frequently Asked Questions"}
        </SectionHeading>

        <div className="mx-auto max-w-3xl divide-y divide-border">
          {faqs.map((faq) => (
            <FaqItem key={faq._key} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-neutral-800 md:text-lg">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={cn(
            "mt-1 shrink-0 text-neutral-400 transition-transform duration-300",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm leading-relaxed text-neutral-500 md:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
