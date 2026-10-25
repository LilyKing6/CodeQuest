/** SJF 调度核心计算（纯函数，可单测） */
export interface SchedProc {
  name: string;
  burst: number;
}

export interface SchedResult {
  order: SchedProc[];
  /** 每个进程的等待时间（按顺序） */
  waits: number[];
  /** 平均等待时间 */
  avgWait: number;
  /** 完成时间线（甘特图用） */
  timeline: { name: string; start: number; end: number }[];
}

export function simulateSchedule(order: SchedProc[]): SchedResult {
  let t = 0;
  const waits: number[] = [];
  const timeline: SchedResult["timeline"] = [];
  for (const p of order) {
    waits.push(t);
    timeline.push({ name: p.name, start: t, end: t + p.burst });
    t += p.burst;
  }
  const avgWait = order.length ? waits.reduce((a, b) => a + b, 0) / order.length : 0;
  return { order, waits, avgWait, timeline };
}

export function formatAvg(v: number): string {
  return (Math.round(v * 100) / 100).toFixed(2);
}
