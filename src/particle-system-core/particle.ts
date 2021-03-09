class Particle {
  x = 0
  y = 0
  age = -1
  color: [number, number, number, number] = [100, 50, 100, 1]

  /**
   * 
   * @param {Number} options.x 像素x坐标
   * @param {Number} options.y 像素y坐标
   * @param {Number} options.age 粒子生命值
   * @param {Number[]} options.color 粒子rgb颜色数组
   */
  constructor(options: {
    x: number,
    y: number,
    age: number,
    color: [number, number, number, number] | undefined
  }) {
    this.x = options.x
    this.y = options.y
    this.age = options.age
    if (options.color !== undefined)
      this.color = options.color // rgb(100, 50, 100) 默认颜色
  }
}

export default Particle