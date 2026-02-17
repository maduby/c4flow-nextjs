"use client";

import { useState, useRef } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { trackContactFormSubmit } from "@/lib/analytics";

interface ContactFormSectionProps {
  heading?: string | null;
  subtitle?: string | null;
  successMessage?: string | null;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactFormSection({
  heading,
  subtitle,
  successMessage,
}: ContactFormSectionProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const message = (formData.get("message") as string).trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      trackContactFormSubmit();
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section className="relative overflow-hidden py-12 md:py-24">
      {/* Decorative orb */}
      <div
        className="gradient-orb absolute -right-32 top-0 h-80 w-80"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <SectionHeading subtitle={subtitle}>
          {heading || "Send a Message"}
        </SectionHeading>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              className="mx-auto max-w-lg rounded-2xl border border-teal-500/30 bg-teal-50 p-8 text-center"
              role="alert"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <CheckCircle
                  size={48}
                  className="mx-auto mb-4 text-teal-500"
                  aria-hidden="true"
                />
              </motion.div>
              <h3 className="text-xl font-bold text-neutral-800">
                Message Sent!
              </h3>
              <p className="mt-2 text-neutral-600">
                {successMessage ||
                  "Thank you for reaching out. We'll get back to you soon!"}
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full border border-border px-6 py-2 text-sm font-medium text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              ref={formRef}
              onSubmit={handleSubmit}
              className="mx-auto max-w-lg space-y-5"
              noValidate
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm font-medium text-neutral-600"
                >
                  Name <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-border px-4 py-3 text-neutral-800 placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm font-medium text-neutral-600"
                >
                  Email <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border px-4 py-3 text-neutral-800 placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-medium text-neutral-600"
                >
                  Message <span className="text-pink-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  placeholder="Tell us what you're interested in..."
                  className="w-full rounded-lg border border-border px-4 py-3 text-neutral-800 placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {status === "error" && errorMsg && (
                  <motion.div
                    className="flex items-start gap-2 rounded-lg border border-pink-200 bg-pink-50 p-3 text-sm text-pink-600"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "submitting"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 py-3 text-sm font-medium text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
