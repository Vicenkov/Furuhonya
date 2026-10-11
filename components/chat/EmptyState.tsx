"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  FileSearch,
  Lightbulb,
  PenLine,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";

type Suggestion = {
  title: string;
  hint: string;
  prompt: string;
  icon: LucideIcon;
};

const SUGGESTIONS: Suggestion[] = [
  {
    title: "Explain something",
    hint: "Break down a topic simply",
    prompt: "Explain how the internet works in simple terms.",
    icon: Lightbulb,
  },
  {
    title: "Write for me",
    hint: "Emails, essays, captions",
    prompt: "Write a short, polite email asking my teacher for a deadline extension.",
    icon: PenLine,
  },
  {
    title: "Untangle a problem",
    hint: "Take it one step at a time",
    prompt: "Help me solve a problem step by step. Here it is: ",
    icon: Puzzle,
  },
  {
    title: "Read a file",
    hint: "Summarize or review text",
    prompt: "Summarize the key points of this text: ",
    icon: FileSearch,
  },
];

type EmptyStateProps = {
  onSelectPrompt: (prompt: string) => void;
};

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  const { settings } = useAppSettings();
  const reduceMotion = useReducedMotion();
  const isVietnamese = settings.language === "vi";
  const suggestions = isVietnamese
    ? [
        { title: "Giải thích một điều", hint: "Phân tích chủ đề cho dễ hiểu", prompt: "Giải thích cách Internet hoạt động bằng ngôn ngữ đơn giản." },
        { title: "Viết giúp tôi", hint: "Email, bài luận, caption", prompt: "Viết email lịch sự xin giáo viên gia hạn thời hạn nộp bài." },
        { title: "Gỡ một vấn đề", hint: "Đi từng bước một", prompt: "Giúp tôi giải quyết vấn đề này từng bước: " },
        { title: "Đọc một tệp", hint: "Tóm tắt hoặc xem lại văn bản", prompt: "Tóm tắt các ý chính của văn bản sau: " },
      ]
    : SUGGESTIONS;

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-12 sm:py-12 lg:px-20">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
        className="my-auto w-full max-w-[820px] py-8 text-left"
      >
        <h2 className="max-w-[14ch] font-display text-[clamp(40px,7vw,72px)] font-medium leading-[1.04] tracking-tight">
          {isVietnamese ? (
            <>Hôm nay bạn muốn tìm hiểu <em className="text-accent">điều gì?</em></>
          ) : (
            <>What would you like to <em className="text-accent">explore?</em></>
          )}
        </h2>
        <p className="mt-5 max-w-[54ch] text-lg text-fg-muted">
          {isVietnamese
            ? "Hỏi bất cứ điều gì, Furuhonya sẽ cùng bạn đào sâu."
            : "Ask anything, and Furuhonya will help you dig deeper."}
        </p>

        <ol className="mt-10 max-w-[700px] divide-y divide-line border-y border-line">
          {suggestions.map(({ title, hint, prompt }, index) => (
            <li key={title}>
              <motion.button
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.22,
                  delay: reduceMotion ? 0 : Math.min(index, 10) * 0.025,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
                className="suggestion-row flex min-h-[76px] w-full items-center gap-4 px-3 py-3 text-left"
              >
                <span className="label-mono text-fg-muted">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl leading-tight">{title}</span>
                  <span className="mt-1 block text-sm text-fg-muted">{hint}</span>
                </span>
                <ArrowRight className="suggestion-arrow shrink-0" size={19} aria-hidden="true" />
              </motion.button>
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  );
}
