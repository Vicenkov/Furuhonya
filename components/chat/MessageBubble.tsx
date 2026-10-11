"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { MarkdownContent } from "@/components/chat/MarkdownContent";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils/cn";
import { useAppSettings } from "@/hooks/useAppSettings";
import type { Message } from "@/types/chat";

type MessageBubbleProps = {
  message: Message;
  isStreaming?: boolean;
};

function MessageBubbleBase({ message, isStreaming = false }: MessageBubbleProps) {
  const { copied, copy } = useCopyToClipboard(1500);
  const { settings } = useAppSettings();
  const reduceMotion = useReducedMotion();
  const isUser = message.role === "user";
  const label = isUser
    ? settings.language === "vi" ? "BẠN" : "YOU"
    : "FURUHONYA";
  const time = new Intl.DateTimeFormat(settings.language === "vi" ? "vi-VN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(message.createdAt);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      aria-label={isUser ? "You" : "Furuhonya"}
      className={cn("message-row group grid grid-cols-[120px_minmax(0,1fr)] gap-6 py-6", !isUser && message.content.length > 200 && "has-dropcap")}
    >
      <div className="flex flex-col gap-1 pt-1">
        <span className="label-mono text-ink">{label}</span>
        <time className="label-mono text-fg-muted">{time}</time>
      </div>

      <div className="min-w-0 max-w-[68ch]">
        {isUser ? (
          <div className="border-l-2 border-accent pl-4 font-body italic text-[length:var(--chat-font-size)] leading-[1.75] break-words whitespace-pre-wrap text-ink">
            {message.content}
          </div>
        ) : (
          <MarkdownContent content={message.content} isStreaming={isStreaming} />
        )}

        {!isStreaming && message.content && (
          <div className="message-actions mt-2 flex">
            <button
              type="button"
              aria-label={copied
                ? settings.language === "vi" ? "Đã sao chép nội dung" : "Message copied"
                : settings.language === "vi" ? "Sao chép nội dung" : "Copy message"}
              onClick={() => void copy(message.content)}
              className="label-mono inline-flex min-h-10 items-center gap-2 px-2 text-fg-muted hover:text-ink"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied
                ? settings.language === "vi" ? "ĐÃ CHÉP ✓" : "COPIED ✓"
                : settings.language === "vi" ? "SAO CHÉP" : "COPY"}
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export const MessageBubble = memo(MessageBubbleBase);
