"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { ChatHeader } from "@/components/layout/ChatHeader";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { SettingsDialog } from "@/components/sidebar/SettingsDialog";
import { SidebarContent } from "@/components/sidebar/SidebarContent";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassModal } from "@/components/ui/GlassModal";
import type { Conversation } from "@/types/chat";
import { useAppSettings } from "@/hooks/useAppSettings";

const SIDEBAR_WIDTH = 288;
const SIDEBAR_RAIL_WIDTH = 56;

type AppShellProps = {
  children: React.ReactNode;
  composer: React.ReactNode;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
};

export function AppShell({
  children,
  composer,
  conversations,
  activeConversation,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
}: AppShellProps) {
  const { settings } = useAppSettings();
  const reduceMotion = useReducedMotion();
  const isVietnamese = settings.language === "vi";
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchFocusRequest, setSearchFocusRequest] = useState(0);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    setDrawerOpen(false);
  };

  const handleNewChat = () => {
    onNewChat();
    setDrawerOpen(false);
  };

  const handleOpenSettings = () => {
    setDrawerOpen(false);
    setSettingsOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) onDeleteConversation(deleteTargetId);
    setDeleteTargetId(null);
  };

  // Ctrl/Cmd + K: mở sidebar (nếu đang ẩn) rồi nhảy vào ô tìm kiếm
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        if (
          event.key !== "/" ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          event.target instanceof HTMLElement &&
            (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))
        ) return;
        event.preventDefault();
        if (window.matchMedia("(min-width: 768px)").matches) {
          setDesktopCollapsed(false);
        } else {
          setDrawerOpen(true);
        }
        setSearchFocusRequest((count) => count + 1);
        return;
      }
      event.preventDefault();
      if (window.matchMedia("(min-width: 768px)").matches) {
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
    onRename: onRenameConversation,
    onRequestDelete: setDeleteTargetId,
    onOpenSettings: handleOpenSettings,
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      <motion.aside
        initial={false}
        animate={{
          width: desktopCollapsed ? SIDEBAR_RAIL_WIDTH : SIDEBAR_WIDTH,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.2, 0.7, 0.2, 1] }}
        className="hidden h-full shrink-0 overflow-hidden border-r border-ink md:block"
      >
        <SidebarContent {...sidebarProps} collapsed={desktopCollapsed} />
      </motion.aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ChatHeader
          title={activeConversation?.title ?? "New chat"}
          sidebarCollapsed={desktopCollapsed}
          onToggleSidebar={() => setDesktopCollapsed((collapsed) => !collapsed)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <div className="min-h-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeConversation?.id ?? "new"}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.15 }}
              className="h-full min-h-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 z-10 w-full px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
          {composer}
        </div>
      </main>

      {/* Sidebar for smaller screens */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
        <SidebarContent
          {...sidebarProps}
          headerAction={
            <GlassButton
              variant="ghost"
              aria-label="Close sidebar"
              onClick={closeDrawer}
              className="h-11 w-11 px-0"
            >
              <X size={18} />
            </GlassButton>
          }
        />
      </MobileDrawer>

      {/* Hộp thoại xác nhận xóa */}
      <GlassModal
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title={isVietnamese ? "Xóa cuộc trò chuyện?" : "Delete conversation?"}
      >
        <p className="text-sm text-fg-muted">
          {isVietnamese
            ? "Cuộc trò chuyện sẽ bị xóa vĩnh viễn. Bạn không thể hoàn tác thao tác này."
            : "This conversation will be permanently deleted. This cannot be undone."}
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <GlassButton onClick={() => setDeleteTargetId(null)}>
            {isVietnamese ? "Hủy" : "Cancel"}
          </GlassButton>
          <GlassButton variant="danger" onClick={confirmDelete}>
            {isVietnamese ? "Xóa" : "Delete"}
          </GlassButton>
        </div>
      </GlassModal>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}