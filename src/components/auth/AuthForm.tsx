"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = isRegister
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (res.error) {
        setError(
          isRegister ? registerError(res.error) : "邮箱或密码不正确，再试一次？",
        );
        return;
      }
      router.push("/learn");
      router.refresh();
    } catch {
      // 网络层异常（断网/代理闪断）：better-auth 客户端可能以 rejection 形式抛出
      setError("网络异常，请检查连接后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black">
          {isRegister ? "创建冒险者档案" : "欢迎回来"}
        </h1>
        <p className="mt-2 text-sm text-ink-dim">
          {isRegister
            ? "注册后可保存进度、点亮星星并登上排行榜"
            : "登录继续你的知识冒险"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6 sm:p-8">
        {isRegister && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              冒险者名号
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="显示在排行榜上的名字"
              required
              maxLength={30}
              autoComplete="nickname"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            密码
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isRegister ? "至少 8 个字符" : ""}
            required
            minLength={8}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full !py-3">
          {loading ? "处理中…" : isRegister ? "开始冒险 →" : "登录"}
        </Button>

        <p className="text-center text-sm text-ink-dim">
          {isRegister ? (
            <>
              已有账号？{" "}
              <Link href="/login" className="text-neon-strong hover:underline">
                去登录
              </Link>
            </>
          ) : (
            <>
              还没有账号？{" "}
              <Link href="/register" className="text-neon-strong hover:underline">
                免费注册
              </Link>
            </>
          )}
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint">
        只是路过？每个主题的{" "}
        <Link href="/learn" className="text-cyan hover:underline">
          第一关
        </Link>{" "}
        免登录就能玩。
      </p>
    </div>
  );
}

function registerError(err: { status?: number; statusText?: string }): string {
  if (err.status === 422 || /exist/i.test(err.statusText ?? "")) {
    return "这个邮箱已经注册过了，直接登录试试。";
  }
  return "注册失败，请检查输入（密码至少 8 位）后重试。";
}
