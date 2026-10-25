import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // pnpm workspace 下固定 tracing root，保证 standalone 产物完整
  outputFileTracingRoot: __dirname,
  // 关闭开发模式右下角指示器：其持续动画会干扰自动化测试的帧稳定性
  devIndicators: false,
};

export default nextConfig;
