"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Moon, Plus, Search, Sparkles, Sun } from "lucide-react";
import { ConversationItem } from "@/components/sidebar/ConversationItem";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { normalizeForSearch } from "@/lib/utils/text";
import type { Conversation } from "@/types/chat";

type SidebarContentProps = {
  conversations: Conversation[];
  activeId: string | null;
  headerAction?: React.ReactNode;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onRequestDelete: (id: string) => void;
};

export function SidebarContent({
  conversations,
  activeId,
  headerAction,
  onNewChat,
  onSelect,
  onRename,
  onRequestDelete,
}: SidebarContentProps) {
  const [query, setQuery] = useState("");

  const visibleConversations = useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    if (!needle) return conversations;
    return conversations.filter((item) =>
      normalizeForSearch(item.title).includes(needle),
    );
  }, [conversations, query]);

  const hasQuery = query.trim() !== "";

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2 pl-2">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Sparkles size={20} className="text-accent" />
          AI Chat
        </div>
        {headerAction}
      </div>

      <GlassButton variant="accent" className="w-full" onClick={onNewChat}>
        <Plus size={18} />
        New chat
      </GlassButton>

      <div className="relative">
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fg-muted"
        />
        <GlassInput
          data-sidebar-search
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && query) {
              event.stopPropagation();
              setQuery("");
            }
          }}
          placeholder="Search chats"
          aria-label="Search conversations"
          className="h-11 rounded-[18px] pl-10"
        />
      </div>

      <nav
        aria-label="Conversations"
        className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1"
      >
        {visibleConversations.length === 0 ? (
          <p className="px-2 text-sm text-fg-muted">
            {hasQuery ? "No matching conversations." : "No conversations yet."}
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {visibleConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeId}
                  onSelect={onSelect}
                  onRename={onRename}
                  onRequestDelete={onRequestDelete}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </nav>

      {/* Nút đổi giao diện tạm thời. Phase 11 sẽ thay bằng Settings. */}
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