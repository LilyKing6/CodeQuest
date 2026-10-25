import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-sm text-ink-faint sm:flex-row sm:justify-between">
        <p>
          <span className="font-mono text-ink-dim">CodeQuest</span> · 在游戏中理解计算机
        </p>
        <div className="flex items-center gap-4">
          <Link href="/learn" className="transition-colors hover:text-ink-dim">
            开始闯关
          </Link>
          <Link href="/leaderboard" className="transition-colors hover:text-ink-dim">
            排行榜
          </Link>
        </div>
      </div>
    </footer>
  );
}
