"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { trackWhatsAppClick } from "@/lib/analytics";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export function WhatsAppButton({ phoneNumber, message }: WhatsAppButtonProps) {
  const url = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      aria-label="Chat on WhatsApp (opens in new tab)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
