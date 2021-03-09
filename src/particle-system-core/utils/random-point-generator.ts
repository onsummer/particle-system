function randomPoint2D(
  count: number,
  zoom = [-100, 100],
  numberFixed = 4,
  handler = (result: [number, number][]) => result): [number, number][] {

  let result: [number, number][] = []
  if (count < 1) {
    return result
  }

  const scale = zoom[1] - zoom[0]
  for (let i = 0; i < count; i++) {
    result.push([
      round(zoom[0] + scale * Math.random(), numberFixed),
      round(zoom[0] + scale * Math.random(), numberFixed)
    ])
  }

  /** 加入自定义处理机制 */
  result = handler(result)

  return result
}

/**
 * 四舍五入
 * @param {Number} value 待四舍五入的数字
 * @param {Number} n 四舍五入的位数
 */
function round(value: number, n: number) {
  if (isNaN(value)) {
    return 0
  }
  const p1 = Math.pow(10, n + 1)
  const p2 = Math.pow(10, n)
  return Math.round(value * p1 / 10) / p2
}

export {
  round,
  randomPoint2D
}