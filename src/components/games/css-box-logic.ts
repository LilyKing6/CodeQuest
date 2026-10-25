/**
 * CSS 盒模型宽度计算（纯函数，可单测）。
 * content-sizing（默认 box-sizing: content-box）下的总宽：
 *   总宽 = content + 2×padding + 2×border
 * 注：margin 不计入元素自身宽度（它影响的是布局占位），这也是常见考点。
 */

export interface BoxSpec {
  contentWidth: number;
  /** 左右 padding 之和 */
  padding: number;
  /** 左右 border 之和 */
  border: number;
}

export function totalWidth(spec: BoxSpec): number {
  return spec.contentWidth + spec.padding * 2 + spec.border * 2;
}

/** 与目标的差值（>0 还差多少，<0 超了多少） */
export function widthDiff(spec: BoxSpec, target: number): number {
  return totalWidth(spec) - target;
}

/** margin 是否影响元素自身总宽（教学判断，用于解析文案） */
export const MARGIN_AFFECTS_WIDTH = false;
