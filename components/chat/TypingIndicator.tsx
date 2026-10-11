"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAppSettings } from "@/hooks/useAppSettings";

export function TypingIndicator() {
  const { settings } = useAppSettings();
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      role="status"
      aria-label="Furuhonya is writing"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      className="message-row grid grid-cols-[120px_minmax(0,1fr)] gap-6 border-t border-line py-6"
    >
      <div className="flex flex-col gap-1 pt-1">
        <span className="label-mono text-ink">FURUHONYA</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="label-mono text-fg-muted">
          {settings.language === "vi" ? "ĐANG VIẾT" : "WRITING"}
        </span>
        <span className="writing-dots inline-flex gap-1" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
    </motion.div>
  );
}