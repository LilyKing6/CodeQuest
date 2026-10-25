import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { THEMES } from "@/content/registry";

const TOTAL_LEVELS = THEMES.reduce((n, t) => n + t.levels.length, 0);
const TOTAL_MINIGAMES = THEMES.reduce(
  (n, t) => n + t.levels.filter((l) => l.type === "minigame").length,
  0,
);

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-20 text-center sm:pt-28">
          <Badge tone="cyan" className="animate-rise font-mono">
            gamified CS learning
          </Badge>
          <h1 className="animate-rise mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            在游戏中
            <span className="bg-gradient-to-r from-neon-strong via-neon-soft to-cyan-strong bg-clip-text text-transparent">
              理解计算机
            </span>
          </h1>
          <p className="animate-rise mt-5 max-w-2xl text-balance text-base leading-relaxed text-ink-dim sm:text-lg">
            从二进制到信息安全，{TOTAL_LEVELS} 个关卡将计算机基础知识拆成一场冒险。
            答题闯关点亮星星，动手玩转 CPU、网络与排序的互动模拟，
            每一颗星都是真实掌握的知识点。
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/register" className="!px-7 !py-3 !text-base">
              开始冒险 →
            </LinkButton>
            <LinkButton href="/learn" variant="ghost" className="!px-7 !py-3 !text-base">
              先逛逛关卡地图
            </LinkButton>
          </div>

          <dl className="animate-rise mt-14 grid w-full max-w-2xl grid-cols-3 gap-3 text-center">
            {[
              [String(THEMES.length), "知识大陆"],
              [String(TOTAL_LEVELS), "闯关关卡"],
              [String(TOTAL_MINIGAMES), "互动小游戏"],
            ].map(([num, label]) => (
              <div key={label} className="card px-4 py-5">
                <dt className="font-mono text-2xl font-black text-neon-strong sm:text-3xl">
                  {num}
                </dt>
                <dd className="mt-1 text-xs text-ink-dim sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 主题总览 */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">知识大陆</h2>
            <p className="mt-1 text-sm text-ink-dim">
              {THEMES.length} 大片主题大陆层层递进，解锁一片大陆，点亮一颗技能树
            </p>
          </div>
          <Link
            href="/learn"
            className="text-sm text-neon-strong transition-colors hover:text-neon-soft"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme, i) => (
            <Link
              key={theme.id}
              href={`/learn/${theme.id}`}
              className="card card-hover group relative overflow-hidden p-6"
            >
              <span
                className="absolute -right-6 -top-6 size-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30"
                style={{ background: theme.color }}
                aria-hidden
              />
              <div className="flex items-center gap-3">
                <span
                  className="grid size-11 place-items-center rounded-xl text-2xl"
                  style={{ background: `${theme.color}22` }}
                >
                  {theme.icon}
                </span>
                <span className="font-mono text-xs text-ink-faint">
                  {String(i + 1).padStart(2, "0")} / {String(THEMES.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{theme.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                {theme.description}
              </p>
              <p className="mt-4 font-mono text-xs text-cyan">
                {theme.levels.length} 个关卡 ·{" "}
                {theme.levels.filter((l) => l.type === "minigame").length} 个小游戏
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
