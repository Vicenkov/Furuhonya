"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createId } from "@/lib/utils/id";
import type { ChatStatus, Message } from "@/types/chat";

// TẠM THỜI: file này chỉ để thử giao diện, sẽ bị xóa khi nối AI thật (Phase 7-8).

const DEMO_REPLY = [
  "## A quick demo",
  "",
  "This reply is **fake** and streamed from your browser. It only exists to test the chat UI. A real AI answer arrives in Phase 7.",
  "",
  "### What to check",
  "",
  "- **Bold**, *italic* and `inline code`",
  "- A [link](https://nextjs.org) that opens in a new tab",
  "- Lists, tables and code blocks",
  "",
  "1. Scroll up while it types: the view should stop following",
  "2. Click the arrow button to jump back down",
  "",
  "| Phase | Topic | Status |",
  "| --- | --- | --- |",
  "| 5 | Chat UI | Now |",
  "| 6 | Composer | Next |",
  "| 7 | AI API | Later |",
  "",
  "```ts",
  "function greet(name: string): string {",
  "  // This block should be colored and have a copy button",
  "  return `Hello, ${name}!`;",
  "}",
  "```",
  "",
  "> Blockquotes work too.",
  "",
  "### Some filler to make the page scroll",
  "",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "",
  "That is the end. Try the copy button under this message.",
].join("\n");

const FIRST_DELAY_MS = 900;
const TICK_MS = 25;
const CHARS_PER_TICK = 4;

export function useFakeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || status !== "idle") return;

      const conversationId = "demo";
      setMessages((previous) => [
        ...previous,
        {
          id: createId(),
          conversationId,
          role: "user",
          content,
          createdAt: Date.now(),
        },
      ]);
      setStatus("waiting");

      timeoutRef.current = setTimeout(() => {
        const assistantId = createId();
        let cursor = CHARS_PER_TICK;

        setMessages((previous) => [
          ...previous,
          {
            id: assistantId,
            conversationId,
            role: "assistant",
            content: DEMO_REPLY.slice(0, cursor),
            createdAt: Date.now(),
          },
        ]);
        setStatus("streaming");

        intervalRef.current = setInterval(() => {
          cursor = Math.min(cursor + CHARS_PER_TICK, DEMO_REPLY.length);
          const partial = DEMO_REPLY.slice(0, cursor);

          setMessages((previous) =>
            previous.map((message) =>
              message.id === assistantId ? { ...message, content: partial } : message,
            ),
          );

          if (cursor >= DEMO_REPLY.length) {
            clearTimers();
            setStatus("idle");
          }
        }, TICK_MS);
      }, FIRST_DELAY_MS);
    },
    [status, clearTimers],
  );

  return { messages, status, send };
}