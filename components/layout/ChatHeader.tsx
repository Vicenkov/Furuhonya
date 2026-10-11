import { Menu, PanelLeft } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { useAppSettings } from "@/hooks/useAppSettings";

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
  const { settings } = useAppSettings();
  const isVietnamese = settings.language === "vi";
  return (
    <header className="h-[52px] shrink-0 border-b border-line pt-[env(safe-area-inset-top)]">
      <div className="flex h-full items-center gap-2 px-3 sm:px-5">
        <GlassButton
          variant="ghost"
          aria-label={isVietnamese ? "Mở danh sách trò chuyện" : "Open sidebar"}
          onClick={onOpenDrawer}
          className="h-11 w-11 px-0 md:hidden"
        >
          <Menu size={20} />
        </GlassButton>

        <GlassButton
          variant="ghost"
          aria-label={sidebarCollapsed
            ? isVietnamese ? "Hiện thanh bên" : "Show sidebar"
            : isVietnamese ? "Ẩn thanh bên" : "Hide sidebar"}
          aria-expanded={!sidebarCollapsed}
          onClick={onToggleSidebar}
          className="hidden h-11 w-11 px-0 md:inline-flex"
        >
          <PanelLeft size={20} />
        </GlassButton>

        <h1 className="min-w-0 flex-1 truncate font-display text-lg font-medium">
          {title === "New chat"
            ? isVietnamese ? "Trang chưa đặt tên" : "Untitled page"
            : title}
        </h1>

        <div className="label-mono shrink-0 text-ink">FURUHONYA AI</div>
      </div>
    </header>
  );
}