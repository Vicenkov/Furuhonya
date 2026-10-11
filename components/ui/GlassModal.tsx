"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

type GlassModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  sidePanel?: boolean;
};

export function GlassModal({ open, onClose, title, children, sidePanel = false }: GlassModalProps) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-50 flex ${sidePanel ? "justify-end" : "items-center justify-center p-4"}`}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
        >
          <div
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_40%,transparent)]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduceMotion ? false : sidePanel ? { x: "100%" } : { opacity: 0, y: 6 }}
            animate={sidePanel ? { x: 0 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : sidePanel ? { x: "100%" } : { opacity: 0, y: 6 }}
            transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className={`print-panel relative outline-none ${
              sidePanel
                ? "h-full w-[min(440px,100vw)] overflow-y-auto border-y-0 border-r-0 p-5 sm:p-7"
                : "w-full max-w-md p-6"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id={titleId} className="font-display text-xl font-semibold">
                {title}
              </h2>
              <GlassButton
                variant="ghost"
                aria-label="Close dialog"
                onClick={onClose}
                className="h-11 w-11 px-0"
              >
                <X size={18} />
              </GlassButton>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}