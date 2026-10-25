/** 冒泡排序核心（纯函数，可单测） */

/** 统计逆序对个数 = 相邻交换排序的最少交换次数 */
export function countInversions(arr: number[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) count++;
    }
  }
  return count;
}
