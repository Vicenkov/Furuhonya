import { Moon, Plus, Sparkles, Sun } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

export function SidebarContent() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2 px-2 pt-1 text-lg font-semibold tracking-tight">
        <Sparkles size={20} className="text-accent" />
        AI Chat
      </div>

      <GlassButton variant="accent" className="w-full">
        <Plus size={18} />
        New chat
      </GlassButton>

      <p className="flex-1 px-2 text-sm text-fg-muted">
        Conversation history will appear here.
      </p>

      {/* Nút đổi giao diện tạm thời để thử dark mode. Phase 11 sẽ thay bằng Settings. */}
      <GlassButton
        variant="ghost"
        className="w-full justify-start"
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        <Moon size={18} className="dark:hidden" />
        <Sun size={18} className="hidden dark:block" />
        Toggle theme
      </GlassButton>
    </div>
  );
}