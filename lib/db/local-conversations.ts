import type { Conversation } from "@/types/chat";
import { createId } from "@/lib/utils/id";

const STORAGE_KEY = "chatbot.conversations.v1";
const MAX_TITLE_LENGTH = 80;
const EMPTY: Conversation[] = [];

const listeners = new Set<() => void>();
let cache: Conversation[] | null = null;

function isConversation(value: unknown): value is Conversation {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.createdAt === "number" &&
    typeof item.updatedAt === "number"
  );
}

function sortByRecent(list: Conversation[]): Conversation[] {
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
}

function readFromStorage(): Conversation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? sortByRecent(parsed.filter(isConversation)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function commit(next: Conversation[]) {
  cache = sortByRecent(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Bộ nhớ đầy hoặc bị chặn: app vẫn chạy trong phiên này, chỉ không lưu được.
  }
  listeners.forEach((listener) => listener());
}

// ---- Phần dành cho React (useSyncExternalStore) ----

export function subscribe(listener: () => void) {
  listeners.add(listener);

  // Đồng bộ khi bạn sửa dữ liệu ở một tab khác
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getSnapshot(): Conversation[] {
  cache ??= readFromStorage();
  return cache;
}

export function getServerSnapshot(): Conversation[] {
  return EMPTY;
}

// ---- Thao tác ----

export function createConversation(): Conversation {
  const now = Date.now();
  const conversation: Conversation = {
    id: createId(),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
  };
  commit([conversation, ...getSnapshot()]);
  return conversation;
}

export function renameConversation(id: string, title: string) {
  const trimmed = title.trim().slice(0, MAX_TITLE_LENGTH);
  if (!trimmed) return; // tiêu đề rỗng thì giữ nguyên tên cũ
  commit(
    getSnapshot().map((item) =>
      item.id === id ? { ...item, title: trimmed } : item,
    ),
  );
}

export function deleteConversation(id: string) {
  commit(getSnapshot().filter((item) => item.id !== id));
}