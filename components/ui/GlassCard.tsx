import { cn } from "@/lib/utils/cn";

type GlassCardProps = React.ComponentProps<"div"> & {
  interactive?: boolean;
};

export function GlassCard({
  interactive = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "book-card p-5",
        interactive &&
          "transition-transform duration-200 ease-out hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}