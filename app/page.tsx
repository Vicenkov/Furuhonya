"use client";

import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/chat/EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import {
  Composer,
  type ComposerHandle,
} from "@/components/chat/Composer";
import { useFakeChat } from "@/hooks/useFakeChat";

export default function Home() {
  const { messages, status, send } = useFakeChat();

  const [draft, setDraft] = useState("");

  const composerRef =
    useRef<ComposerHandle>(null);

  const submit = () => {
    const content = draft.trim();

    if (!content || status !== "idle") {
      return;
    }

    send(content);
    setDraft("");

    requestAnimationFrame(() => {
      composerRef.current?.focus();
    });
  };

  const handleSelectPrompt = (prompt: string) => {
    setDraft(prompt);

    requestAnimationFrame(() => {
      composerRef.current?.focus();
    });
  };

  const handleStop = () => {
    // Phase 6 chỉ chuẩn bị giao diện Stop.
    // Abort streaming thật sẽ nối ở Phase AI thật.
  };

  const composer = (
    <Composer
      ref={composerRef}
      value={draft}
      onChange={setDraft}
      onSubmit={submit}
      onStop={handleStop}
      status={status}
    />
  );

  return (
    <AppShell composer={composer}>
      {messages.length === 0 ? (
        <EmptyState
          onSelectPrompt={handleSelectPrompt}
        />
      ) : (
        <MessageList
          messages={messages}
          status={status}
        />
      )}
    </AppShell>
  );
}