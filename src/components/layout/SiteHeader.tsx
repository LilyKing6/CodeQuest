"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/learn", label: "闯关地图" },
  { href: "/leaderboard", label: "排行榜" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [session, setSession] = useState<null | {
    user: { name: string } | null;
  }>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    authClient.getSession().then((res) => {
      setSession(res.data);
      setChecked(true);
    });
  }, [pathname]);

  async function handleSignOut() {
    await authClient.signOut();
    setSession(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-wide">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-neon to-cyan font-mono text-sm text-white shadow-[0_0_14px_rgba(139,92,246,0.45)]">
            &gt;_
          </span>
          <span className="hidden sm:inline">
            Code<span className="text-neon-strong">Quest</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-1.5 font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-surface-2 text-ink"
                  : "text-ink-dim hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 text-sm">
          {!checked ? (
            <span className="h-8 w-20 animate-pulse rounded-lg bg-surface-2" />
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                className="max-w-36 truncate rounded-lg px-3 py-1.5 font-medium text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
                title={session.user.name}
              >
                {session.user.name}
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg px-3 py-1.5 text-ink-faint transition-colors hover:text-bad"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 font-medium text-ink-dim transition-colors hover:text-ink"
              >
                登录
              </Link>
              <Link href="/register" className="btn-neon !px-4 !py-1.5 !text-sm">
                免费注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
