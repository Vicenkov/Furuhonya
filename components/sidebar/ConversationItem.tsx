"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Pencil, Trash2 } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { cn } from "@/lib/utils/cn";
import type { Conversation } from "@/types/chat";
import { useAppSettings } from "@/hooks/useAppSettings";

type ConversationItemProps = {
  conversation: Conversation;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onRequestDelete: (id: string) => void;
};

export function ConversationItem({
  conversation,
  index,
  isActive,
  onSelect,
  onRename,
  onRequestDelete,
}: ConversationItemProps) {
  const { settings } = useAppSettings();
  const isVietnamese = settings.language === "vi";
  const reduceMotion = useReducedMotion();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const isEditingRef = useRef(false);

  const startEditing = () => {
    setDraft(conversation.title);
    isEditingRef.current = true;
    setIsEditing(true);
  };

  const finishEditing = (save: boolean) => {
    if (!isEditingRef.current) return;
    isEditingRef.current = false;
    setIsEditing(false);
    if (save) onRename(conversation.id, draft);
  };

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1], delay: reduceMotion ? 0 : Math.min(index, 10) * 0.025 }}
      className="group relative min-w-0 w-full"
    >
      {isEditing ? (
        <input
          autoFocus
          value={draft}
          maxLength={80}
          aria-label={isVietnamese ? "Tên cuộc trò chuyện" : "Conversation title"}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={(event) => event.target.select()}
          onBlur={() => finishEditing(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) finishEditing(true);
            if (event.key === "Escape") {
              event.stopPropagation();
              finishEditing(false);
            }
          }}
          className="input-line h-11 w-full min-w-0 px-2 text-sm text-ink outline-none"
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => onSelect(conversation.id)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "index-entry flex min-h-11 w-full min-w-0 items-center gap-2 border-b border-dotted border-line py-1 pl-2 pr-[76px] text-left text-sm transition-colors",
              isActive
                ? "border-l-[3px] border-l-accent bg-surface text-ink"
                : "border-l-[3px] border-l-transparent text-fg-muted hover:bg-surface hover:text-ink",
            )}
          >
            <span className="label-mono shrink-0 text-fg-muted">№ {String(index + 1).padStart(3, "0")}</span>
            <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
          </button>

          <div className="reveal-on-hover absolute inset-y-0 right-0 flex items-center bg-surface">
            <GlassButton
              variant="ghost"
              aria-label={isVietnamese ? `Đổi tên ${conversation.title}` : `Rename ${conversation.title}`}
              onClick={startEditing}
              className="h-11 w-11 px-0 sm:w-9"
            >
              <Pencil size={14} />
            </GlassButton>
            <GlassButton
              variant="ghost"
              aria-label={isVietnamese ? `Xóa ${conversation.title}` : `Delete ${conversation.title}`}
              onClick={() => onRequestDelete(conversation.id)}
              className="h-11 w-11 px-0 sm:w-9"
            >
              <Trash2 size={14} />
            </GlassButton>
          </div>
        </>
      )}
    </motion.li>
  );
}
