"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils/cn";

type Variant = "accent" | "ghost" | "danger";

type GlassButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  accent: "btn-primary !text-[19px] !font-bold !leading-none",
  ghost: "btn-ghost",
  danger: "btn-danger !text-[19px] !font-bold !leading-none",
};

export function GlassButton({
  variant = "ghost",
  type = "button",
  className,
  ...props
}: GlassButtonProps) {
  return (
    <motion.button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}