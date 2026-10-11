import { cn } from "@/lib/utils/cn";

type GlassInputProps = React.ComponentProps<"input">;

export function GlassInput({ className, ...props }: GlassInputProps) {
  return (
    <input
      className={cn(
        "input-line h-12 w-full px-4 text-sm outline-none placeholder:text-fg-muted disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}