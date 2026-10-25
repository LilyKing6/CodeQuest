import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";

export const dynamic = "force-dynamic";

/** 健康检查：DB 连通性 + 进程信息（容器 healthcheck / 监控探针用） */
export async function GET() {
  try {
    await db.run(sql`SELECT 1`);
    return NextResponse.json({
      status: "ok",
      time: new Date().toISOString(),
      uptimeSec: Math.round(process.uptime()),
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
