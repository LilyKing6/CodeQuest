import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-6xl font-black text-neon/40">404</p>
      <h1 className="mt-4 text-2xl font-bold">这一页不存在</h1>
      <p className="mt-2 text-sm text-ink-dim">
        可能是链接打错了，或者关卡还没被你解锁。
      </p>
      <Link href="/learn" className="btn-neon mt-6">
        回到闯关地图
      </Link>
    </div>
  );
}
