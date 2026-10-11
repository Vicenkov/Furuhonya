"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <motion.div
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_40%,transparent)]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] min-w-0 overflow-hidden border-r border-ink bg-paper pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            initial={reduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "-100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}