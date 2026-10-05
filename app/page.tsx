import { AppShell } from "@/components/layout/AppShell";
import { GlassInput } from "@/components/ui/GlassInput";

export default function Home() {
  return (
    <AppShell
      composer={
        <GlassInput placeholder="Type your message..." aria-label="Message" />
      }
    >
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          How can I help you?
        </h2>
        <p className="mt-2 text-fg-muted">
          Ask anything, explore ideas, or get things done.
        </p>
      </div>
    </AppShell>
  );
}