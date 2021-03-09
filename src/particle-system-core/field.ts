import { IPowerVector } from "../typings/IPowerVector"

/**
 * 一维数组转二维数组
 * @private
 * @param {Number} width 网格宽度，正整数
 * @param {Number} height 网格高度，正整数
 * @param {Number[]} data 数据数组
 */
function createGrid(field: Field, width: number, height: number, data: number[][]) {
  for (let i = 0; i < height; i++) {
    const tempRow = [] // 一行
    for (let j = 0; j < width; j++) {
      const idx = i * width + j
      tempRow.push({ 
        x: i, 
        y: j, 
        lon: data[0][idx],
        lat: data[1][idx]
      })  // 每个格子即一个拥有 x、y（行列）和数据 v 的 “向量”
    }
    field.grid.push(tempRow)
  }
}

class Field {

  _grid: IPowerVector[][] = []
  _gridWidth: number
  _gridHeight: number

  /**
   * 2D向量场。落在场内的点，均会受到场内的点的影响，从而改变运动轨迹。
   * 
   * @constructor
   * @param {Number} options.gridWidth 
   * @param {Number} options.gridHeight
   * @param {*} options.dataset
   */
  constructor(options: {
    gridWidth: number,
    gridHeight: number,
    dataset: number[][]
  }) {
    const {
      gridWidth,
      gridHeight,
      dataset // 一维数组，能通过 col×row 的值索引数据
    } = options
    this._gridWidth = gridWidth
    this._gridHeight = gridHeight
    createGrid(this, gridWidth, gridHeight, dataset)
  }

  get grid() {
    return this._grid
  }

  get gridWidth() {
    return this._gridWidth
  }

  get gridHeight() {
    return this._gridHeight
  }
}

export default Field