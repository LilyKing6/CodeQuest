import { cn } from "@/lib/cn";

export function StarIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(
        "size-5",
        filled ? "fill-warn text-warn drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "fill-line text-line",
        className,
      )}
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.12 6.56L12 17.55l-5.9 3.1 1.13-6.56L2.46 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

/** 星星展示：filled 为已点亮数量（0~3），animate 时逐个弹出 */
export function Stars({
  filled,
  total = 3,
  className,
}: {
  filled: number;
  total?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: total }, (_, i) => (
        <StarIcon key={i} filled={i < filled} />
      ))}
    </span>
  );
}
