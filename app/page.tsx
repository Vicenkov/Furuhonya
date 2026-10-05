"use client";

import { useState } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassModal } from "@/components/ui/GlassModal";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  // Chỉ để thử ở Phase 2. Phase 11 sẽ làm chuyển theme đầy đủ (nhớ lựa chọn, theo hệ thống).
  const toggleTheme = () => document.documentElement.classList.toggle("dark");

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center p-4 sm:p-6">
      <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Design system
            </h1>
            <p className="mt-1 text-fg-muted">
              Phase 2 preview: Liquid Glass components.
            </p>
          </div>
          <GlassButton
            aria-label="Toggle light and dark mode"
            onClick={toggleTheme}
            className="w-11 shrink-0 px-0"
          >
            <Moon size={18} className="dark:hidden" />
            <Sun size={18} className="hidden dark:block" />
          </GlassButton>
        </div>

        <GlassInput placeholder="Type your message..." aria-label="Message" />

        <div className="flex flex-wrap gap-3">
          <GlassButton variant="accent">Accent</GlassButton>
          <GlassButton>Glass</GlassButton>
          <GlassButton variant="ghost">Ghost</GlassButton>
          <GlassButton disabled>Disabled</GlassButton>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <GlassCard interactive>
            <Sparkles size={20} className="mb-3 text-accent" />
            <h2 className="font-medium">Explain something</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Hover me to see the light sweep.
            </p>
          </GlassCard>
          <GlassCard>
            <h2 className="font-medium">Static card</h2>
            <p className="mt-1 text-sm text-fg-muted">
              No hover effect on this one.
            </p>
          </GlassCard>
        </div>

        <GlassButton onClick={() => setModalOpen(true)} className="self-start">
          Open modal
        </GlassButton>
      </GlassPanel>

      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Glass modal"
      >
        <p className="text-sm text-fg-muted">
          Press Esc or click outside to close.
        </p>
        <div className="mt-5 flex justify-end">
          <GlassButton variant="accent" onClick={() => setModalOpen(false)}>
            Done
          </GlassButton>
        </div>
      </GlassModal>
    </main>
  );
}