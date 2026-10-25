import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CodeQuest · 游戏化学计算机",
    template: "%s · CodeQuest",
  },
  description:
    "通过闯关游戏学习计算机知识：二进制、CPU、操作系统、网络、算法、数据库、Web 开发与信息安全。答题与互动小游戏结合，点亮你的计算机知识地图。",
  keywords: ["计算机基础", "学编程", "计算机知识", "闯关学习", "CS 学习网站", "SQL", "信息安全"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "CodeQuest",
    title: "CodeQuest · 在游戏中理解计算机",
    description:
      "8 大片知识大陆、44 个关卡、14 个互动小游戏——答题与动手模拟结合，把计算机基础拆成一场冒险。",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeQuest · 在游戏中理解计算机",
    description: "8 大片知识大陆、44 个关卡、14 个互动小游戏的计算机基础闯关学习网站。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}
