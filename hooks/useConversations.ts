import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  createConversation,
  deleteConversation,
  getServerSnapshot,
  getSnapshot,
  renameConversation,
  subscribe,
} from "@/lib/db/local-conversations";

export function useConversations() {
  const conversations = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? null,
    [conversations, activeId],
  );

  const startNewChat = useCallback(() => {
    setActiveId(createConversation().id);
  }, []);

  return {
    conversations,
    activeConversation,
    selectConversation: setActiveId,
    startNewChat,
    renameConversation,
    removeConversation: deleteConversation,
  };
}