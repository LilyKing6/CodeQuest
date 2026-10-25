import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  // 内置限流：登录/注册接口防爆破（生产默认开启，这里显式声明并收紧）
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },
  advanced: {
    // 生产走 https（自有服务器挂反代时终止 TLS），开发用 http
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
