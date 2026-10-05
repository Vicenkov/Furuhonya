"use client";

import { useCallback, useEffect, useRef, useState } from "react";

async function writeText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Rơi xuống cách dự phòng bên dưới
  }

  // Dự phòng: trang mở bằng http://192.168.x.x (không phải localhost hay https)
  // thì trình duyệt không cung cấp navigator.clipboard.
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}

export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      const succeeded = await writeText(text);
      if (!succeeded) return false;

      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), resetAfterMs);
      return true;
    },
    [resetAfterMs],
  );

  return { copied, copy };
}