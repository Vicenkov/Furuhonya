"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils/cn";

type Variant = "glass" | "accent" | "ghost" | "danger";

type GlassButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  glass: "glass glass-sheen text-fg",
  accent:
    "bg-accent text-accent-fg shadow-[0_6px_20px_-6px_var(--accent)]",
  ghost: "text-fg-muted hover:bg-[var(--glass-bg)] hover:text-fg",
  danger: "bg-red-600 text-white",
};

export function GlassButton({
  variant = "glass",
  type = "button",
  className,
  ...props
}: GlassButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-[14px] px-4 text-sm font-medium",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}