"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { PanelLeftClose, X } from "lucide-react";
import { ChatHeader } from "@/components/layout/ChatHeader";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { SidebarContent } from "@/components/sidebar/SidebarContent";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassModal } from "@/components/ui/GlassModal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useConversations } from "@/hooks/useConversations";

const SIDEBAR_WIDTH = 288;
const SIDEBAR_GAP = 16;

type AppShellProps = {
  children: React.ReactNode;
  composer: React.ReactNode;
};

export function AppShell({ children, composer }: AppShellProps) {
  const {
    conversations,
    activeConversation,
    selectConversation,
    startNewChat,
    renameConversation,
    removeConversation,
  } = useConversations();

  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchFocusRequest, setSearchFocusRequest] = useState(0);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleSelect = (id: string) => {
    selectConversation(id);
    setDrawerOpen(false);
  };

  const handleNewChat = () => {
    startNewChat();
    setDrawerOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTargetId) removeConversation(deleteTargetId);
    setDeleteTargetId(null);
  };

  // Ctrl/Cmd + K: mở sidebar (nếu đang ẩn) rồi nhảy vào ô tìm kiếm
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }
      event.preventDefault();
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setDesktopCollapsed(false);
      } else {
        setDrawerOpen(true);
      }
      setSearchFocusRequest((count) => count + 1);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Chạy sau khi sidebar/drawer đã hiện ra trong trang
  useEffect(() => {
    if (searchFocusRequest === 0) return;
    const inputs = document.querySelectorAll<HTMLInputElement>(
      "[data-sidebar-search]",
    );
    const visibleInput = Array.from(inputs).find(
      (input) => input.getClientRects().length > 0,
    );
    visibleInput?.focus({ preventScroll: true });
    visibleInput?.select();
  }, [searchFocusRequest]);

  const sidebarProps = {
    conversations,
    activeId: activeConversation?.id ?? null,
    onNewChat: handleNewChat,
    onSelect: handleSelect,
    onRename: renameConversation,
    onRequestDelete: setDeleteTargetId,
  };

  return (
    <div className="flex h-dvh overflow-hidden lg:p-4">
      {/* Sidebar cho màn hình lớn */}
      <motion.aside
        initial={false}
        animate={{
          width: desktopCollapsed ? 0 : SIDEBAR_WIDTH,
          marginRight: desktopCollapsed ? 0 : SIDEBAR_GAP,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        inert={desktopCollapsed}
        className="hidden shrink-0 overflow-hidden lg:block"
      >
        <GlassPanel className="h-full w-72">
          <SidebarContent
            {...sidebarProps}
            headerAction={
              <GlassButton
                variant="ghost"
                aria-label="Collapse sidebar"
                onClick={() => setDesktopCollapsed(true)}
                className="h-9 w-9 px-0"
              >
                <PanelLeftClose size={18} />
              </GlassButton>
            }
          />
        </GlassPanel>
      </motion.aside>

      {/* Khung chat chính: toàn màn hình trên điện thoại */}
      <GlassPanel className="flex min-w-0 flex-1 flex-col overflow-hidden max-lg:rounded-none max-lg:border-0">
        <ChatHeader
          title={activeConversation?.title ?? "New chat"}
          sidebarCollapsed={desktopCollapsed}
          onToggleSidebar={() => setDesktopCollapsed((collapsed) => !collapsed)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <div className="min-h-0 flex-1">{children}</div>

        <div className="px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
          {composer}
        </div>
      </GlassPanel>

      {/* Sidebar cho điện thoại và tablet */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
        <SidebarContent
          {...sidebarProps}
          headerAction={
            <GlassButton
              variant="ghost"
              aria-label="Close sidebar"
              onClick={closeDrawer}
              className="h-9 w-9 px-0"
            >
              <X size={18} />
            </GlassButton>
          }
        />
      </MobileDrawer>

      {/* Hộp thoại xác nhận xóa: đặt ở đây, ngoài các khung kính (xem lưu ý dưới) */}
      <GlassModal
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title="Delete conversation?"
      >
        <p className="text-sm text-fg-muted">
          This conversation will be permanently deleted. This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <GlassButton onClick={() => setDeleteTargetId(null)}>Cancel</GlassButton>
          <GlassButton variant="danger" onClick={confirmDelete}>
            Delete
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  );
}