"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Moon, Plus, Search, Settings, Sun } from "lucide-react";
import { ConversationItem } from "@/components/sidebar/ConversationItem";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { normalizeForSearch } from "@/lib/utils/text";
import type { Conversation } from "@/types/chat";
import { useAppSettings } from "@/hooks/useAppSettings";

type SidebarContentProps = {
  conversations: Conversation[];
  activeId: string | null;
  collapsed?: boolean;
  headerAction?: React.ReactNode;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onRequestDelete: (id: string) => void;
  onOpenSettings: () => void;
};

type ConversationGroup = {
  label: string;
  conversations: Conversation[];
};

function groupConversations(conversations: Conversation[]): ConversationGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const groups: ConversationGroup[] = [
    { label: "TODAY", conversations: [] },
    { label: "LAST 7 DAYS", conversations: [] },
    { label: "OLDER", conversations: [] },
  ];

  for (const conversation of conversations) {
    const updatedAt = conversation.updatedAt || conversation.createdAt;
    if (updatedAt >= startOfToday) groups[0].conversations.push(conversation);
    else if (updatedAt >= weekAgo) groups[1].conversations.push(conversation);
    else groups[2].conversations.push(conversation);
  }

  return groups;
}

export function SidebarContent({
  conversations,
  activeId,
  collapsed = false,
  headerAction,
  onNewChat,
  onSelect,
  onRename,
  onRequestDelete,
  onOpenSettings,
}: SidebarContentProps) {
  const { settings, updateSettings } = useAppSettings();
  const isVietnamese = settings.language === "vi";
  const [query, setQuery] = useState("");

  const visibleConversations = useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    if (!needle) return conversations;
    return conversations.filter((item) =>
      normalizeForSearch(item.title).includes(needle),
    );
  }, [conversations, query]);
  const groups = useMemo(() => groupConversations(visibleConversations), [visibleConversations]);
  const hasQuery = query.trim() !== "";

  return (
    <div className={`flex h-full min-w-0 flex-col overflow-hidden ${collapsed ? "items-center px-1 py-4" : "px-5 py-5"}`}>
      <div className={`mb-6 flex min-h-8 w-full min-w-0 items-center ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
        <div className={`flex min-w-0 items-center ${collapsed ? "" : "gap-2"}`}>
          <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center border border-ink bg-accent font-display text-[19px] font-bold leading-none text-accent-ink">古</span>
          {!collapsed && (
            <>
              <span className="truncate font-display text-[22px] font-semibold tracking-tight">Furuhonya</span>
              <span className="label-mono shrink-0 text-fg-muted">AI</span>
            </>
          )}
        </div>
        {!collapsed && headerAction}
      </div>

      <GlassButton
        variant="accent"
        className={`mb-5 min-h-11 ${collapsed ? "w-11 px-0" : "w-full"}`}
        onClick={onNewChat}
        aria-label={isVietnamese ? "Trang mới" : "New page"}
        title={collapsed ? (isVietnamese ? "Trang mới" : "New page") : undefined}
      >
        <Plus size={18} className="shrink-0" />
        {!collapsed && <span className="min-w-0 truncate">{isVietnamese ? "Trang mới" : "New page"}</span>}
      </GlassButton>

      {!collapsed && (
        <div className="relative mb-6 min-w-0">
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-fg-muted" />
          <GlassInput
            data-sidebar-search
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.stopPropagation();
                setQuery("");
              }
            }}
            placeholder={isVietnamese ? "Tìm trong mục lục…" : "Search the index…"}
            aria-label={isVietnamese ? "Tìm trong mục lục" : "Search the index"}
            className="h-11 min-w-0 max-w-full pl-6 pr-10"
          />
          <kbd className="label-mono pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-fg-muted">/</kbd>
        </div>
      )}

      {!collapsed && (
        <nav
          aria-label={isVietnamese ? "Mục lục cuộc trò chuyện" : "Conversation index"}
          className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
        >
          {visibleConversations.length === 0 ? (
            <p className="break-words py-2 text-sm text-fg-muted">
              {hasQuery
                ? isVietnamese ? "Không tìm thấy cuộc trò chuyện." : "No matching conversations."
                : isVietnamese ? "Chưa có cuộc trò chuyện." : "No conversations yet."}
            </p>
          ) : (
            groups.map((group) => group.conversations.length > 0 && (
              <section key={group.label} className="mb-5">
                <h2 className="label-mono mb-2 text-fg-muted">
                  {isVietnamese
                    ? group.label === "TODAY" ? "HÔM NAY" : group.label === "LAST 7 DAYS" ? "7 NGÀY QUA" : "CŨ HƠN"
                    : group.label}
                </h2>
                <ul className="flex flex-col">
                  <AnimatePresence initial={false}>
                    {group.conversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        index={visibleConversations.indexOf(conversation)}
                        isActive={conversation.id === activeId}
                        onSelect={onSelect}
                        onRename={onRename}
                        onRequestDelete={onRequestDelete}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
            ))
          )}
        </nav>
      )}
      {collapsed && <div className="min-h-0 flex-1" />}

      <div className={`mt-4 flex w-full flex-col gap-2 border-t border-line pt-4 ${collapsed ? "items-center" : ""}`}>
        <GlassButton
          variant="ghost"
          className={`min-h-11 ${collapsed ? "w-11 px-0" : "w-full justify-start"}`}
          onClick={onOpenSettings}
          aria-label={isVietnamese ? "Cài đặt" : "Settings"}
          title={collapsed ? (isVietnamese ? "Cài đặt" : "Settings") : undefined}
        >
          <Settings size={18} />
          {!collapsed && <span>{isVietnamese ? "Cài đặt" : "Settings"}</span>}
        </GlassButton>
        {!collapsed && (
          <GlassButton
            variant="ghost"
            className="min-h-11 w-full justify-start"
            onClick={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" })}
            aria-label={isVietnamese ? "Chuyển chế độ sáng tối" : "Toggle light and dark mode"}
          >
            {settings.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{settings.theme === "dark" ? (isVietnamese ? "Ngày" : "Day") : (isVietnamese ? "Đêm" : "Night")}</span>
          </GlassButton>
        )}
      </div>
    </div>
  );
}
