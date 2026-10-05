"use client";

import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { ChatHeader } from "@/components/layout/ChatHeader";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { SidebarContent } from "@/components/sidebar/SidebarContent";
import { GlassPanel } from "@/components/ui/GlassPanel";

const SIDEBAR_WIDTH = 288;
const SIDEBAR_GAP = 16;

type AppShellProps = {
  children: React.ReactNode;
  composer: React.ReactNode;
};

export function AppShell({ children, composer }: AppShellProps) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

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
          <SidebarContent />
        </GlassPanel>
      </motion.aside>

      {/* Khung chat chính: toàn màn hình trên điện thoại */}
      <GlassPanel className="flex min-w-0 flex-1 flex-col overflow-hidden max-lg:rounded-none max-lg:border-0">
        <ChatHeader
          sidebarCollapsed={desktopCollapsed}
          onToggleSidebar={() => setDesktopCollapsed((collapsed) => !collapsed)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        <div className="px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
          {composer}
        </div>
      </GlassPanel>

      {/* Sidebar cho điện thoại và tablet */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
        <SidebarContent />
      </MobileDrawer>
    </div>
  );
}