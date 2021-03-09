import { IPoint2D } from "../typings/IPoint2D"

enum XYOrder {
  x = 'x',
  y = 'y'
}

/**
 * 计算双线性内插点的值
 * @param {IPoint2D} pt 目标点位
 * @param {IPoint2D} p1 左上
 * @param {IPoint2D} p2 右上
 * @param {IPoint2D} p3 左下
 * @param {IPoint2D} p4 右下
 * 
 * @returns {Number} pt的插值结果
 */
const bilinearInterpolation2D = (pt: IPoint2D, p1: IPoint2D, p2: IPoint2D, p3: IPoint2D, p4: IPoint2D) => {
  const xt1 = linearInterpolation2D(pt, p1, p2)
  const xt2 = linearInterpolation2D(pt, p3, p4)
  const val = ((p1.y - pt.y) * xt1 + (pt.y - p3.y) * xt2) / (p1.y - p3.y)
  pt.value = val
  return val
}


/**
 * 计算双线性内插点的值
 * 
 *  pt[待插值变量] = a·(b·p1[待插值的变量] + c·p2[待插值的变量] + d·p3[待插值的变量] + e·p4[待插值的变量])
 * 
 *  其中
 *    a = 1/((p2.x - p4.x)·(p2.y - p4.y))
 *    b = (p2.x - pt.x)(p2.y - pt.y)
 *    c = (pt.x - p1.x)(p1.y - pt.y)
 *    d = (p3.x - pt.x)(pt.y - p3.y)
 *    e = (pt.x - p4.x)(pt.y - p4.y)
 * 
 * @param {IPoint2D} pt 目标点位
 * @param {IPoint2D} p1 左上
 * @param {IPoint2D} p2 右上
 * @param {IPoint2D} p3 左下
 * @param {IPoint2D} p4 右下
 */
const bilinearInterpolation2D_2 = (pt: IPoint2D, p1: IPoint2D, p2: IPoint2D, p3: IPoint2D, p4: IPoint2D) => {
  const a = (p2.x - p4.x) * (p2.y - p4.y)
  const b = (p2.x - pt.x) * (p2.y - pt.y)
  const c = (pt.x - p1.x) * (p1.y - pt.y)
  const d = (p3.x - pt.x) * (pt.y - p3.y)
  const e = (pt.x - p4.x) * (pt.y - p4.y)

  return (b * p4.value + c * p3.value + d * p2.value + e * p1.value) / a
}

/**
 * 线性插值
 * @param {IPoint2D} pt 待插值点
 * @param {IPoint2D} p1 左点
 * @param {IPoint2D} p2 右点
 * @param {XYOrder} order 顺序，可以是 'x' 或 'y'，默认是 'x'
 */
const linearInterpolation2D = (pt: IPoint2D, p1: IPoint2D, p2: IPoint2D, order: XYOrder = XYOrder.x) => {
  if (order === XYOrder.x) {
    const k1 = (p2.x - pt.x) / (p2.x - p1.x)
    const k2 = (pt.x - p1.x) / (p2.x - p1.x)
    return k1 * p1.value + k2 * p2.value
  }
  else {
    const k1 = (p2.y - pt.y) / (p2.y - p1.y)
    const k2 = (pt.y - p1.y) / (p2.y - p1.y)
    return k1 * p1.value + k2 * p2.value
  }
}

/**
 * 逆双线性插值算法，计算凸四边形内任意一点的插值。
 *
 * 插值公式
 * 
 *  value_pt =
 *    value_p1 +
 *    (value_p2 - value_p1) * u +
 *    (value_p4 - value_p1) * v +
 *    (value_p1 - value_p2 + value_p3 - value_p4) * uv
 *
 * 而 u、v 则满足如下方程组
 *
 *  · av^2 + bv + c = 0
 *  · u = [ (pt.x - p1.x) - (p4.x - p1.x) * v ] / [ (p2.x - p1.x) + (p1.x - p2.x + p3.x - p4.x) * v ]
 *
 * 其中，a、b、c 参数可由坐标计算而来
 * 
 *  · a = (p1.x - p2.x + p3.x - p4.x) * (p4.y - p1.y) - (p1.y - p2.y + p3.y - p4.y) * (p4.x - p1.x)
 *  · b = (p2.x - p1.x) * (p4.y - p1.y) - (p2.y - p1.y) * (p4.x - p1.x)
 *        + (pt.x - p1.x) * (p1.y - p2.y + p3.y - p4.y) - (pt.y - p1.y) * (p1.x - p2.x + p3.x - p4.x)
 *  · c = (pt.x - p1.x) * (p2.y - p1.y) - (pt.y - p1.y) * (p2.x - p1.x)
 *
 * 求根公式可得到 v 的解，取 [0,1] 区间内的值即可。
 * 
 * @todo
 * 注意，若 p1p2 和 p3p4 共线，则 a = 0，即解一元一次方程 bv + c = 0 => v = -c/b.
 *
 * @see https://blog.csdn.net/lk040384/article/details/104939742
 * 
 * @param {IPoint2D} pt 待插值 2D 点
 * @param {IPoint2D} p1 点1
 * @param {IPoint2D} p2 点2
 * @param {IPoint2D} p3 点3
 * @param {IPoint2D} p4 点4
 */
const inverseBilinearInterpolation2D = (pt: IPoint2D, p1: IPoint2D, p2: IPoint2D, p3: IPoint2D, p4: IPoint2D) => {
  if (isPointWithinQuadrilateral(pt, p1, p2, p3, p4) === false) {
    return
  }

  let k1 = 0, k2 = 0
  const a = (p1.x - p2.x + p3.x - p4.x) * (p4.y - p1.y) - (p1.y - p2.y + p3.y - p4.y) * (p4.x - p1.x)
  const b = (p2.x - p1.x) * (p4.y - p1.y) - (p2.y - p1.y) * (p4.x - p1.x) + (pt.x - p1.x) * (p1.y - p2.y + p3.y - p4.y) - (pt.y - p1.y) * (p1.x - p2.x + p3.x - p4.x)
  const c = (pt.x - p1.x) * (p2.y - p1.y) - (pt.y - p1.y) * (p2.x - p1.x)
  const delta = b ** 2 - 4 * a * c
  if (delta < 0) {
    throw new RangeError('delta is smaller than zero.')
  }

  const sqrtDelta = Math.sqrt(delta)

  /** calc v */
  k2 = (-b + sqrtDelta) / (2 * a)
  if (k2 < 0 || k2 > 1) {
    k2 = (-b - sqrtDelta) / (2 * a)
  }
  /** calc u */
  k1 = ((pt.x - p1.x) - (p4.x - p1.x) * k2) / ((p2.x - p1.x) + (p1.x - p2.x + p3.x - p4.x) * k2)

  /** calc value of pt */
  const val = p1.value + (p2.value - p1.value) * k1 + (p4.value - p1.value) * k2 + (p1.value - p2.value + p3.value - p4.value) * k1 * k2
  pt.value = val
  return val
}

/**
 * 判断点是否在四边形内，使用顺时针逆时针算法：若均为顺时针，则点在四边形内
 * 其中，p1、p2、p3、p4 为四边形顺时针的四个顶点
 * 
 *     p1 -———> p2
 *      ↑ ↘↖  ↙↗ |
 *      |   pt   |
 *      | ↙↗  ↘↖ ↓
 *     p4 <-——— p3
 * 
 * @param {IPoint2D} pt 待判断的 2D 点
 * @param {IPoint2D} p1 四边形的点1
 * @param {IPoint2D} p2 四边形的点2
 * @param {IPoint2D} p3 四边形的点3
 * @param {IPoint2D} p4 四边形的点4
 * @returns {Boolean}
 */
const isPointWithinQuadrilateral = (pt: IPoint2D, p1: IPoint2D, p2: IPoint2D, p3: IPoint2D, p4: IPoint2D) => {
  const booleanArr: boolean[] = []
  booleanArr.push(isClockWise(p1, p2, pt))
  booleanArr.push(isClockWise(p2, p3, pt))
  booleanArr.push(isClockWise(p3, p4, pt))
  booleanArr.push(isClockWise(p4, p1, pt))
  return booleanArr.every(v => v === true)
}

/**
 * 判断三个 2D 点的顺序是否为顺时针，是则返回 true，否则返回 false。
 * 
 *     p1
 *    ↗  ↘
 *   p3 ← p2
 * 
 * @param {IPoint2D} p1 点1
 * @param {IPoint2D} p2 点2
 * @param {IPoint2D} p3 点3
 * @returns {Boolean}
 */
const isClockWise = (p1: IPoint2D, p2: IPoint2D, p3: IPoint2D): boolean => {
  return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y) < 0
}

/**
 * 
 * @param {IPoint2D} pt 待测试点
 * @param {IPoint2D} p1 点1
 * @param {IPoint2D} p2 点2
 * @param {IPoint2D} p3 点3
 * @param {IPoint2D} p4 点4
 * 
 * @returns {Number[][]} 若返回 [[1,2]] 则代表pt在1、2点外，若返回[[1,2],[2,3]]则代表在1、2、3点外
 */
const onWhichSide = (pt: IPoint2D, p1: IPoint2D, p2: IPoint2D, p3: IPoint2D, p4: IPoint2D) => {
  const flags = [
    isClockWise(p1, p2, pt),
    isClockWise(p2, p3, pt),
    isClockWise(p3, p4, pt),
    isClockWise(p4, p1, pt),
  ]
  let sidePointIds: number[][] = []
  flags.forEach((v, i, _) => {
    if (v == false) {
      // 若i是3，i+2必定是5，那么得让它i-2才行
      sidePointIds.push([i + 1, i + 2 > flags.length ? i - 2 : i + 2])
    }
  })
  return sidePointIds
}

export {
  bilinearInterpolation2D,
  bilinearInterpolation2D_2,
  inverseBilinearInterpolation2D,
  isPointWithinQuadrilateral,
  isClockWise,
  onWhichSide
}