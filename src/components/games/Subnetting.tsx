"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { MiniGameProps } from "./types";
import type { SubnettingConfig } from "@/content/types";
import { finishMiniGame } from "./shared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/**
 * 子网划分：把地址卡拖进正确的子网（或标记为「外部地址」）。
 * 核心判断抽成 hostGroupOf 纯函数（见下），可单测。
 */
type Bucket = string; // 组名或 "__decoy"（不属于任何组）

export default function Subnetting({ level, nextLevelId, authed, onFinish }: MiniGameProps) {
  const config = level.config as SubnettingConfig;

  const allAddresses = useMemo(() => {
    const valid = config.groups.map((g) => g.name);
    // 每组生成 2 个合法地址 + 全部干扰项
    const cards: { addr: string; truth: Bucket }[] = [];
    for (const g of config.groups) {
      for (const host of hostsOf(g.hostPart, 2)) {
        cards.push({ addr: host, truth: g.name });
      }
    }
    for (const d of config.decoys) cards.push({ addr: d, truth: "__decoy" });
    return shuffle(cards);
  }, [config]);

  const [placed, setPlaced] = useState<Record<string, Bucket>>({});
  const [dragAddr, setDragAddr] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const remaining = allAddresses.filter((c) => !placed[c.addr]);
  const correctCount = allAddresses.filter((c) => placed[c.addr] === c.truth).length;

  function place(bucket: Bucket) {
    if (!dragAddr) return;
    setPlaced((p) => ({ ...p, [dragAddr]: bucket }));
    setDragAddr(null);
    setChecked(false);
  }

  async function submit() {
    setChecked(true);
    const perf = Math.round((correctCount / allAddresses.length) * 100);
    if (perf >= 100) {
      await finishMiniGame({ level, nextLevelId, authed, onFinish }, 100);
    } else if (perf >= 75) {
      // 允许一次纠错机会：返回继续
    }
  }

  const perfect = correctCount === allAddresses.length;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card p-5 text-center">
        <Badge tone="cyan">公司网段</Badge>
        <p className="mt-2 font-mono text-2xl font-black text-neon-strong">{config.cidr}</p>
        <p className="mt-1 text-xs text-ink-faint">
          /25 子网掩码 255.255.255.128：最后一个字节 ≥ 128 的属于后半段
        </p>
      </div>

      {/* 待分组地址 */}
      {remaining.length > 0 && (
        <div className="card p-5">
          <p className="mb-3 text-sm font-medium">
            拖动地址卡片到正确的子网（或拖到「外部地址」）：
          </p>
          <div className="flex flex-wrap gap-2">
            {remaining.map((c) => (
              <motion.button
                key={c.addr}
                layout
                draggable
                onDragStart={() => setDragAddr(c.addr)}
                onDragEnd={() => setDragAddr(null)}
                onClick={() => setDragAddr(dragAddr === c.addr ? null : c.addr)}
                className={`rounded-lg border px-3.5 py-2 font-mono text-sm transition-all ${
                  dragAddr === c.addr
                    ? "border-neon bg-neon/15 text-neon-strong"
                    : "border-line bg-surface-2 hover:border-line-active"
                }`}
              >
                {c.addr}
              </motion.button>
            ))}
          </div>
          {dragAddr && (
            <p className="mt-3 text-xs text-cyan">
              已选中 {dragAddr} —— 点击下方任意分组放置它
            </p>
          )}
        </div>
      )}

      {/* 分组目标 */}
      <div className="grid gap-3 sm:grid-cols-3">
        {config.groups.map((g) => {
          const items = allAddresses.filter((c) => placed[c.addr] === g.name);
          return (
            <DropZone
              key={g.name}
              title={g.name}
              items={items.map((c) => c.addr)}
              checked={checked}
              onDropBucket={() => place(g.name)}
              truthOf={(addr) => allAddresses.find((c) => c.addr === addr)?.truth === g.name}
            />
          );
        })}
        <DropZone
          title="🚫 外部地址（不属于本网段）"
          items={allAddresses.filter((c) => placed[c.addr] === "__decoy").map((c) => c.addr)}
          checked={checked}
          onDropBucket={() => place("__decoy")}
          truthOf={(addr) => allAddresses.find((c) => c.addr === addr)?.truth === "__decoy"}
        />
      </div>

      {/* 提交 */}
      {remaining.length === 0 && (
        <div className="text-center">
          <Button onClick={submit} disabled={checked && perfect} className="min-w-48">
            {checked ? (perfect ? "全部正确！🎉" : "有放错的，点击卡片改一改") : "提交分组结果"}
          </Button>
        </div>
      )}
      {checked && !perfect && (
        <p className="text-center text-sm text-warn">
          红色卡片放错了。提示：先看第一个字节是否 192.168.8，再看最后一段与 128 的大小。
        </p>
      )}
    </div>
  );
}

function DropZone({
  title,
  items,
  checked,
  onDropBucket,
  truthOf,
}: {
  title: string;
  items: string[];
  checked: boolean;
  onDropBucket: () => void;
  truthOf: (addr: string) => boolean;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropBucket}
      onClick={items.length >= 0 ? onDropBucket : undefined}
      className="card min-h-36 border-dashed p-4 transition-colors hover:border-neon/60"
    >
      <p className="mb-2 text-xs font-semibold text-ink-dim">{title}</p>
      <div className="space-y-1.5">
        {items.length === 0 && <p className="text-xs text-ink-faint">（空）</p>}
        {items.map((addr) => {
          const ok = truthOf(addr);
          return (
            <span
              key={addr}
              className={`block rounded-lg border px-3 py-1.5 text-center font-mono text-sm ${
                checked
                  ? ok
                    ? "border-ok/60 bg-ok/10 text-ok"
                    : "border-bad/60 bg-bad/10 text-bad"
                  : "border-line bg-surface-2"
              }`}
            >
              {addr} {checked && (ok ? "✓" : "✗")}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** 从 CIDR 生成前 n 个可用主机地址（.1 起，避开网络/广播地址） */
function hostsOf(cidr: string, n: number): string[] {
  const [base, prefixStr] = cidr.split("/");
  const prefix = Number(prefixStr);
  const octets = base.split(".").map(Number);
  const hostBits = 32 - prefix;
  const start = 1; // 第一个可用主机
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const host = start + i;
    const max = (1 << Math.min(hostBits, 8)) - 2; // 排除 .0 与 .255
    if (host > max) break;
    const o = [...octets];
    o[3] = (o[3] & ~((1 << Math.min(hostBits, 8)) - 1)) + host;
    out.push(o.join("."));
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
