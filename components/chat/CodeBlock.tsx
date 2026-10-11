"use client";

import { isValidElement, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useAppSettings } from "@/hooks/useAppSettings";

// Sau khi tô màu, code là một cây phần tử lồng nhau. Hàm này gom lại thành chữ thuần để copy.
function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function extractLanguage(node: ReactNode): string {
  const element = Array.isArray(node) ? node.find((item) => isValidElement(item)) : node;
  if (isValidElement<{ className?: string }>(element)) {
    const match = /language-([\w-]+)/.exec(element.props.className ?? "");
    if (match) return match[1];
  }
  return "text";
}

type CodeBlockProps = {
  children: ReactNode;
};

export function CodeBlock({ children }: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard(1500);
  const { settings } = useAppSettings();
  const isVietnamese = settings.language === "vi";
  const language = extractLanguage(children);

  const handleCopy = () => {
    void copy(extractText(children).replace(/\n$/, ""));
  };

  return (
    <div className="code-frame my-4 overflow-hidden border border-line bg-[var(--code-bg)]">
      <div className="code-frame-header flex h-10 items-center justify-between border-b border-line pr-1.5 pl-4 text-xs">
        <span className="label-mono">{language}</span>
        <GlassButton
          variant="ghost"
          aria-label={copied ? "Code copied" : "Copy code"}
          onClick={handleCopy}
          className="label-mono h-10 gap-1.5 px-2.5"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied
            ? isVietnamese ? "Đã chép ✓" : "Copied ✓"
            : isVietnamese ? "Sao chép" : "Copy"}
        </GlassButton>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[#FFF6EE]">
        {children}
      </pre>
    </div>
  );
}