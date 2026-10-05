"use client";

import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/chat/EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useFakeChat } from "@/hooks/useFakeChat";

export default function Home() {
  const { messages, status, send } = useFakeChat();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isBusy = status !== "idle";
  const canSend = draft.trim() !== "" && !isBusy;

  const submit = () => {
    if (!canSend) return;
    send(draft);
    setDraft("");
  };

  const handleSelectPrompt = (prompt: string) => {
    setDraft(prompt);
    inputRef.current?.focus();
  };

  // Ô nhập TẠM THỜI. Phase 6 sẽ thay bằng composer thật.
  const composer = (
    <div className="flex items-center gap-2">
      <GlassInput
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Type your message..."
        aria-label="Message"
      />
      <GlassButton
        variant="accent"
        aria-label="Send message"
        onClick={submit}
        disabled={!canSend}
        className="w-12 shrink-0 px-0"
      >
        <ArrowUp size={18} />
      </GlassButton>
    </div>
  );

  return (
    <AppShell composer={composer}>
      {messages.length === 0 ? (
        <EmptyState onSelectPrompt={handleSelectPrompt} />
      ) : (
        <MessageList messages={messages} status={status} />
      )}
    </AppShell>
  );
}