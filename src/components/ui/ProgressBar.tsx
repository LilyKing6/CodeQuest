import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  max = 100,
  className,
  gradient = "from-neon to-cyan",
}: {
  value: number;
  max?: number;
  className?: string;
  gradient?: string;
}) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-3", className)}
    >
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-500", gradient)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
