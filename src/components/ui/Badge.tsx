import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neon" | "cyan" | "ok" | "warn" | "bad" | "muted";

const toneClass: Record<Tone, string> = {
  neon: "border-neon/40 bg-neon/10 text-neon-strong",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan-strong",
  ok: "border-ok/40 bg-ok/10 text-ok",
  warn: "border-warn/40 bg-warn/10 text-warn",
  bad: "border-bad/40 bg-bad/10 text-bad",
  muted: "border-line bg-surface-2 text-ink-dim",
};

export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
