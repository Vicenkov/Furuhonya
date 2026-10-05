import { Menu, PanelLeft, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

type ChatHeaderProps = {
  title: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenDrawer: () => void;
};

export function ChatHeader({
  title,
  sidebarCollapsed,
  onToggleSidebar,
  onOpenDrawer,
}: ChatHeaderProps) {
  return (
    <header className="border-b border-[var(--glass-border)] pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        {/* Điện thoại và tablet: mở drawer */}
        <GlassButton
          variant="ghost"
          aria-label="Open sidebar"
          onClick={onOpenDrawer}
          className="w-11 px-0 lg:hidden"
        >
          <Menu size={20} />
        </GlassButton>

        {/* Màn hình lớn: thu gọn / mở rộng sidebar */}
        <GlassButton
          variant="ghost"
          aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          aria-expanded={!sidebarCollapsed}
          onClick={onToggleSidebar}
          className="hidden w-11 px-0 lg:inline-flex"
        >
          <PanelLeft size={20} />
        </GlassButton>

        <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h1>

        {/* Tên model đang để tạm, Phase 7 và 11 sẽ lấy từ cấu hình thật */}
        <div className="glass inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-fg-muted">
          <Sparkles size={14} className="text-accent" />
          GPT-4o mini
        </div>
      </div>
    </header>
  );
}