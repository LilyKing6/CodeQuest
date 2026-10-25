import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CodeQuest · 游戏化学计算机",
    template: "%s · CodeQuest",
  },
  description:
    "通过闯关游戏学习计算机知识：二进制、CPU、操作系统、网络与算法。答题与互动小游戏结合，点亮你的计算机知识地图。",
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
