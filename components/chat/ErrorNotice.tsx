"use client";

import { motion, useReducedMotion } from "motion/react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { useAppSettings } from "@/hooks/useAppSettings";

type ErrorNoticeProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  const { settings } = useAppSettings();
  const reduceMotion = useReducedMotion();
  const isVietnamese = settings.language === "vi";
  return (
    <motion.div
      role="alert"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      className="flex items-center gap-3 border border-danger bg-surface p-3 pl-4 text-sm"
    >
      <AlertCircle size={18} className="shrink-0 text-danger" />
      <p className="min-w-0 flex-1">{message}</p>
      <GlassButton
      aria-label={isVietnamese ? "Thử lại" : "Retry"}
        onClick={onRetry}
        className="h-9 shrink-0 px-3 text-xs"
      >
        <RotateCcw size={14} />
        {isVietnamese ? "Thử lại" : "Retry"}
      </GlassButton>
    </motion.div>
  );
}