import { Sparkles } from "lucide-react";

export function AssistantAvatar() {
  return (
    <div
      aria-hidden="true"
      className="glass mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
    >
      <Sparkles size={16} className="text-accent" />
    </div>
  );
}