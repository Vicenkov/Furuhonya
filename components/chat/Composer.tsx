"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  ArrowUp,
  Mic,
  Plus,
  Square,
} from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { cn } from "@/lib/utils/cn";
import { useAppSettings } from "@/hooks/useAppSettings";
import type { ChatStatus } from "@/types/chat";

export type ComposerHandle = {
  focus: () => void;
  setValue: (value: string) => void;
};

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  status: ChatStatus;
  disabled?: boolean;
};

export const Composer = forwardRef<ComposerHandle, ComposerProps>(
  function Composer(
    {
      value,
      onChange,
      onSubmit,
      onStop,
      status,
      disabled = false,
    },
    ref,
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { settings } = useAppSettings();
    const isVietnamese = settings.language === "vi";

    const isBusy = status !== "idle";
    const canSend = value.trim().length > 0 && !isBusy && !disabled;

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          textareaRef.current?.focus();
        },

        setValue(nextValue: string) {
          onChange(nextValue);

          requestAnimationFrame(() => {
            textareaRef.current?.focus();
          });
        },
      }),
      [onChange],
    );

    const resizeTextarea = () => {
      const textarea = textareaRef.current;

      if (!textarea) return;

      textarea.style.height = "auto";

      const nextHeight = Math.min(textarea.scrollHeight, 238);

      textarea.style.height = `${nextHeight}px`;

      textarea.style.overflowY =
        textarea.scrollHeight > 238 ? "auto" : "hidden";
    };

    useEffect(() => {
      resizeTextarea();
    }, [value]);

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
      if (event.key !== "Enter") return;

      // Shift + Enter = xuống dòng
      if (event.shiftKey) {
        return;
      }

      // Không gửi khi đang dùng IME
      if (event.nativeEvent.isComposing) {
        return;
      }

      event.preventDefault();

      if (canSend) {
        onSubmit();
      }
    };

    const handleChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      onChange(event.target.value);
    };

    return (
      <div className="composer-shell composer-textarea relative mx-auto w-full max-w-[820px] p-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onInput={resizeTextarea}
          disabled={disabled}
          rows={1}
          placeholder={isVietnamese ? "Nhắn cho Furuhonya…" : "Message Furuhonya…"}
          aria-label={isVietnamese ? "Tin nhắn" : "Message"}
          className={cn(
            "block w-full resize-none bg-transparent",
            "min-h-10 max-h-[calc(1.75em*8)] px-3 py-2",
            "text-[length:var(--chat-font-size)] leading-[1.75]",
            "outline-none",
            "placeholder:text-fg-muted",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />

        <div className="flex items-center justify-between gap-2 px-1 pb-1">
          <div className="flex items-center gap-1">
            <GlassButton
              type="button"
              variant="ghost"
              aria-label={isVietnamese ? "Thêm tệp đính kèm" : "Add attachment"}
              disabled={isBusy}
              className="h-11 w-11 px-0 sm:h-9 sm:w-9"
              onClick={() => {
                // File attachment sẽ được nối ở phase sau.
              }}
            >
              <Plus size={18} />
            </GlassButton>

            <GlassButton
              type="button"
              variant="ghost"
              aria-label={isVietnamese ? "Nhập bằng giọng nói" : "Voice input"}
              disabled={isBusy}
              className="h-11 w-11 px-0 sm:h-9 sm:w-9"
              onClick={() => {
                // Voice input sẽ được nối ở phase sau.
              }}
            >
              <Mic size={18} />
            </GlassButton>
          </div>

          <span className="label-mono hidden text-fg-muted sm:block">
            {isVietnamese ? "ENTER GỬI · SHIFT+ENTER XUỐNG DÒNG" : "ENTER SEND · SHIFT+ENTER NEW LINE"}
          </span>

          {isBusy ? (
            <GlassButton
              type="button"
              variant="accent"
              aria-label={isVietnamese ? "Dừng tạo câu trả lời" : "Stop generating"}
              onClick={onStop}
              className="h-11 w-11 px-0 sm:h-10 sm:w-10"
            >
              <Square size={15} fill="currentColor" />
            </GlassButton>
          ) : (
            <GlassButton
              type="button"
              variant="accent"
              aria-label={isVietnamese ? "Gửi tin nhắn" : "Send message"}
              disabled={!canSend}
              onClick={onSubmit}
              className="h-11 w-11 px-0 sm:h-10 sm:w-10 disabled:!opacity-40 disabled:!shadow-none"
            >
              <ArrowUp size={18} />
            </GlassButton>
          )}
        </div>
      </div>
    );
  },
);