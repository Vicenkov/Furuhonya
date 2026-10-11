"use client";

import { useAppSettings } from "@/hooks/useAppSettings";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassModal } from "@/components/ui/GlassModal";
import { clearConversations, deleteConversations } from "@/lib/db/local-conversations";
import { useConversations } from "@/hooks/useConversations";
import { clearActivityLog, deleteActivityEntries } from "@/lib/db/local-settings";
import type { AppFontSize, AppLanguage, AppTheme } from "@/lib/db/local-settings";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { settings, updateSettings } = useAppSettings();
  const { conversations } = useConversations();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [selectedConversationIds, setSelectedConversationIds] = useState<string[]>([]);
  const isVietnamese = settings.language === "vi";

  const labels = isVietnamese
    ? {
        title: "Cài đặt",
        appearance: "Giao diện",
        theme: "Chủ đề",
        light: "Sáng",
        dark: "Tối",
        fontSize: "Cỡ chữ",
        small: "Nhỏ",
        medium: "Vừa",
        large: "Lớn",
        language: "Ngôn ngữ",
        english: "English",
        vietnamese: "Tiếng Việt",
        activity: "Hoạt động gần đây",
        empty: "Chưa có hoạt động.",
        created: "Đã tạo cuộc trò chuyện",
        renamed: "Đã đổi tên cuộc trò chuyện",
        deleted: "Đã xóa cuộc trò chuyện",
        message: "Đã gửi tin nhắn",
        clearAll: "Xóa tất cả",
        chatHistory: "Lịch sử trò chuyện",
        noChats: "Chưa có cuộc trò chuyện.",
        deleteSelected: "Xóa các mục đã chọn",
        selectActivity: (label: string) => `Chọn hoạt động: ${label}`,
        selectConversation: (label: string) => `Chọn cuộc trò chuyện: ${label}`,
        confirmTitle: "Xóa lịch sử và nhật ký?",
        confirmMessage: "Tất cả cuộc trò chuyện, tin nhắn và nhật ký hoạt động đã lưu trên thiết bị này sẽ bị xóa vĩnh viễn.",
        cancel: "Hủy",
        confirm: "Xóa tất cả",
        close: "Đóng cài đặt",
      }
    : {
        title: "Settings",
        appearance: "Appearance",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        fontSize: "Font size",
        small: "Small",
        medium: "Medium",
        large: "Large",
        language: "Language",
        english: "English",
        vietnamese: "Tiếng Việt",
        activity: "Recent activity",
        empty: "No recent activity.",
        created: "Conversation created",
        renamed: "Conversation renamed",
        deleted: "Conversation deleted",
        message: "Message sent",
        clearAll: "Clear All",
        chatHistory: "Chat history",
        noChats: "No saved conversations.",
        deleteSelected: "Delete Selected",
        selectActivity: (label: string) => `Select activity: ${label}`,
        selectConversation: (label: string) => `Select conversation: ${label}`,
        confirmTitle: "Clear history and activity logs?",
        confirmMessage: "All conversations, messages, and activity logs saved on this device will be permanently deleted.",
        cancel: "Cancel",
        confirm: "Clear all",
        close: "Close settings",
      };

  const clearAllData = () => {
    clearConversations();
    clearActivityLog();
    setSelectedActivityIds([]);
    setSelectedConversationIds([]);
    setConfirmClearOpen(false);
  };

  const deleteSelected = () => {
    deleteActivityEntries(selectedActivityIds);
    deleteConversations(selectedConversationIds);
    setSelectedActivityIds([]);
    setSelectedConversationIds([]);
  };

  const selectedCount = selectedActivityIds.filter((id) =>
    settings.activities.some((entry) => entry.id === id),
  ).length + selectedConversationIds.filter((id) =>
    conversations.some((conversation) => conversation.id === id),
  ).length;

  const themeOptions: { value: AppTheme; label: string }[] = [
    { value: "light", label: labels.light },
    { value: "dark", label: labels.dark },
  ];
  const fontOptions: { value: AppFontSize; label: string }[] = [
    { value: "small", label: labels.small },
    { value: "medium", label: labels.medium },
    { value: "large", label: labels.large },
  ];
  const languageOptions: { value: AppLanguage; label: string }[] = [
    { value: "en", label: labels.english },
    { value: "vi", label: labels.vietnamese },
  ];

  return (
    <>
    <GlassModal open={open} onClose={onClose} title={labels.title} sidePanel>
      <div className="space-y-5 overflow-y-auto pr-1">
        <section>
          <h3 className="label-mono mb-3 text-fg-muted">01 — {labels.appearance}</h3>
          <div className="space-y-3">
            <SettingGroup label={labels.theme}>
              {themeOptions.map((option) => (
                <GlassButton
                  key={option.value}
                  variant={settings.theme === option.value ? "accent" : "ghost"}
                  aria-pressed={settings.theme === option.value}
                  onClick={() => updateSettings({ theme: option.value })}
                  className="h-9 flex-1 px-2 text-xs"
                >
                  {option.label}
                </GlassButton>
              ))}
            </SettingGroup>
            <SettingGroup label={labels.fontSize}>
              {fontOptions.map((option) => (
                <GlassButton
                  key={option.value}
                  variant={settings.fontSize === option.value ? "accent" : "ghost"}
                  aria-pressed={settings.fontSize === option.value}
                  onClick={() => updateSettings({ fontSize: option.value })}
                  className="h-9 flex-1 px-2 text-xs"
                >
                  {option.label}
                </GlassButton>
              ))}
            </SettingGroup>
            <SettingGroup label={labels.language}>
              {languageOptions.map((option) => (
                <GlassButton
                  key={option.value}
                  variant={settings.language === option.value ? "accent" : "ghost"}
                  aria-pressed={settings.language === option.value}
                  onClick={() => updateSettings({ language: option.value })}
                  className="h-9 flex-1 px-2 text-xs"
                >
                  {option.label}
                </GlassButton>
              ))}
            </SettingGroup>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="label-mono text-fg-muted">02 — {labels.activity}</h3>
            <span className="label-mono text-fg-muted">{settings.activities.length}</span>
          </div>
          <ol className="max-h-36 space-y-2 overflow-y-auto pr-1" aria-label={labels.activity}>
            {settings.activities.length === 0 ? (
              <li className="border border-line bg-paper px-3 py-2 text-sm text-fg-muted">
                {labels.empty}
              </li>
            ) : settings.activities.map((entry) => {
              const activityLabel = labels[entry.type];
              return (
                <li key={entry.id} className="flex items-center gap-2 border border-line bg-paper px-2 py-2 transition-colors hover:bg-surface">
                  <input
                    type="checkbox"
                    checked={selectedActivityIds.includes(entry.id)}
                    aria-label={labels.selectActivity(activityLabel)}
                    onChange={(event) => setSelectedActivityIds((current) =>
                      event.target.checked
                        ? [...current, entry.id]
                        : current.filter((id) => id !== entry.id),
                    )}
                    className="h-4 w-4 shrink-0 accent-accent"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{activityLabel}</p>
                    {entry.type !== "message" && <p className="truncate text-xs text-fg-muted">{entry.detail}</p>}
                  </div>
                  <time className="label-mono shrink-0 text-fg-muted">
                    {new Intl.DateTimeFormat(isVietnamese ? "vi-VN" : "en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                    }).format(entry.createdAt)}
                  </time>
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="label-mono text-fg-muted">03 — {labels.chatHistory}</h3>
            <span className="label-mono text-fg-muted">{conversations.length}</span>
          </div>
          <ul className="max-h-36 space-y-2 overflow-y-auto pr-1" aria-label={labels.chatHistory}>
            {conversations.length === 0 ? (
              <li className="border border-line bg-paper px-3 py-2 text-sm text-fg-muted">
                {labels.noChats}
              </li>
            ) : conversations.map((conversation) => (
              <li key={conversation.id} className="flex items-center gap-2 border border-line bg-paper px-2 py-2 transition-colors hover:bg-surface">
                <input
                  type="checkbox"
                  checked={selectedConversationIds.includes(conversation.id)}
                  aria-label={labels.selectConversation(conversation.title)}
                  onChange={(event) => setSelectedConversationIds((current) =>
                    event.target.checked
                      ? [...current, conversation.id]
                      : current.filter((id) => id !== conversation.id),
                  )}
                  className="h-4 w-4 shrink-0 accent-accent"
                />
                <span className="min-w-0 flex-1 truncate text-sm">{conversation.title}</span>
                <span className="label-mono shrink-0 text-fg-muted">
                  {conversation.messages.length}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap justify-end gap-2">
          {selectedCount > 0 && (
            <GlassButton
              variant="ghost"
              onClick={deleteSelected}
              className="h-9 text-xs text-danger hover:bg-danger/10"
            >
              <Trash2 size={15} />
              {labels.deleteSelected} ({selectedCount})
            </GlassButton>
          )}
          <GlassButton
            variant="danger"
            onClick={() => setConfirmClearOpen(true)}
            disabled={conversations.length === 0 && settings.activities.length === 0}
            className="h-9 text-xs"
          >
            <Trash2 size={15} />
            {labels.clearAll}
          </GlassButton>
        </div>

        <div className="flex justify-end">
          <GlassButton onClick={onClose} className="h-9 px-3 text-xs">{labels.close}</GlassButton>
        </div>
      </div>
    </GlassModal>
    <GlassModal
      open={confirmClearOpen}
      onClose={() => setConfirmClearOpen(false)}
      title={labels.confirmTitle}
    >
      <p className="text-sm text-fg-muted">{labels.confirmMessage}</p>
      <div className="mt-5 flex justify-end gap-2">
        <GlassButton onClick={() => setConfirmClearOpen(false)}>
          {labels.cancel}
        </GlassButton>
        <GlassButton variant="danger" onClick={clearAllData}>
          <Trash2 size={16} />
          {labels.confirm}
        </GlassButton>
      </div>
    </GlassModal>
    </>
  );
}

type SettingGroupProps = {
  label: string;
  children: React.ReactNode;
};

function SettingGroup({ label, children }: SettingGroupProps) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3">
      <span className="label-mono shrink-0 text-fg-muted">{label}</span>
      <div className="flex min-w-0 gap-1 border border-line bg-paper p-1">{children}</div>
    </div>
  );
}
