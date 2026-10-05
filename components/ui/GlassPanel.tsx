import { cn } from "@/lib/utils/cn";

type GlassPanelProps = React.ComponentProps<"div">;

export function GlassPanel({ className, ...props }: GlassPanelProps) {
  return <div className={cn("glass rounded-[30px]", className)} {...props} />;
}