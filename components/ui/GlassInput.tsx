import { cn } from "@/lib/utils/cn";

type GlassInputProps = React.ComponentProps<"input">;

export function GlassInput({ className, ...props }: GlassInputProps) {
  return (
    <input
      className={cn(
        "glass h-12 w-full rounded-[20px] px-4 text-sm text-fg outline-none",
        "placeholder:text-fg-muted",
        "transition duration-200 ease-out",
        "focus:scale-[1.005] focus:border-accent",
        "focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_20%,transparent)]",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}