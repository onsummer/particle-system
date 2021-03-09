import { inverseBilinearInterpolation2D, isClockWise, onWhichSide } from './src/fn.js'
import { randomPoint2D } from './src/utils/random-point-generator.js'

function Point(x, y, v) {
  this.x = x
  this.y = y
  this.v = v
}

// const randomPoints = randomPoint2D(4, [-10, 10], 4, result => {
//   result.forEach((v, i, arr) => {
//     arr[i] = new Point(v[0], v[1], 0)
//   })
//   return result
// })

/* test group 1
const p1 = new Point(-8.0336, 6.1536, 1)
const p2 = new Point(4.0793, 0.5787, 2)
const p3 = new Point(-4.3149, -4.833, 3)
const p4 = new Point(-9.0849, -2.0879, 4)
const pout = new Point(-10, 0, 0)
*/
const p1 = new Point(114.12931061, 22.43935585, 1)
const p2 = new Point(114.13014221, 22.43938446, 2)
const p3 = new Point(114.13018036, 22.43873405, 3)
const p4 = new Point(114.12931824, 22.43870163, 4)
const pout = new Point(114.1289873, 22.4397613, 0)

const sidePtIds = onWhichSide(pout, p1, p2, p3, p4)
//#region 
// 若 sidePtIds.length == 0，那么进行插值
/* 若不为0，则：
    [1,2] -> 2：整体行列号上移1格
    [2,3] -> 6: 整体行列号右移1格
    [3,4] -> 12: 整体行列号下移1格
    [4,1] -> 4: 整体行列号左移1格
*/
//#endregion
sidePtIds.forEach(group => {
  const tag = group[0] * group[1]
  let orient = undefined
  if (tag === 2)
    orient = '上'
  else if (tag === 6)
    orient = '右'
  else if (tag === 12)
    orient = '下'
  else if (tag === 4)
    orient = '左'
  else {
    inverseBilinearInterpolation2D(pout, p1, p2, p3, p4)
    console.log(`插值结果：${JSON.stringify(pout)}`)
  }
  
  console.log(`点位于第 ${group[0]} 个点和第 ${group[1]} 个点的 ${orient} 侧。`)
})

debugger