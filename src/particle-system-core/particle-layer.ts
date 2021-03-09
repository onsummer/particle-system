import Field from "./field"
import Particle from "./particle"
import ParticleRenderer from "./particle-renderer"
import { Cartesian2, Cartographic, Math as CesiumMath } from "cesium"
import { bilinearInterpolation2D } from "./alg"
import * as turf from '@turf/turf'
import NetCDFReader from '../netcdf'
import { Viewer } from "cesium"
import { INetCDFDimension } from "../typings/INetCDFDimension"

/**
 * 为粒子图层创建粒子
 * @param {ParticleLayer} layer 粒子图层
 * @private
 */
function createParticles(layer: ParticleLayer) {
  const canvasWidth = layer._canvas!.width
  const canvasHeight = layer._canvas!.height
  const maxAge = layer.maxAge

  for (let i = 0; i < layer.particlesCapacity; i++) {
    layer._particles.push(new Particle({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      age: maxAge,
      color: undefined
    })) 
  }
}

/**
 * 选择粒子，被剔除的粒子的生命周期结束，并重新生成新的随机位置粒子
 * @param {ParticleLayer} layer 待选择粒子的图层
 */
function selectParticles(layer: ParticleLayer) {

}

function recreateParticle(deadParticle: Particle, layer: ParticleLayer) {
  const { width, height } = layer._canvas!
  deadParticle = new Particle({
    x: width * Math.random(),
    y: height * Math.random(),
    age: layer.maxAge,
    color: undefined
  })
}

function moveParticle(particle: Particle) {
  particle.age -= 1
}

function checkParticleStatus(particle: Particle) {
  
}

/**
 * 从 NC 数据集解析出某个变量的数据和网格的长宽
 * @param {NetCDFReader} ncdata 
 * @private
 * 
 * !TODO
 */
function parseNCData(ncdata: NetCDFReader) {
  const lonArr = ncdata.getDataVariable('lon_rho') as number[]
  const latArr = ncdata.getDataVariable('lat_rho') as number[]

  const dims = ncdata.dimensions as INetCDFDimension[]
  const rowCount = dims[0].size
  const colCount = dims[1].size

  return {
    gridWidth: rowCount,
    gridHeight: colCount,
    dataset: [lonArr, latArr]
  }
}

class ParticleLayer {
  _particles: Particle[] = []
  _canvas: HTMLCanvasElement | undefined
  _updateFunction!: Function
  _renderer: ParticleRenderer
  maxAge: number
  particlesCapacity: number
  _field: Field | undefined
  particles: any

  constructor(options: {
    maxAge: number,
    particlesNum: number,
    ncdata: NetCDFReader
  }) {
    const {
      maxAge,
      particlesNum,
      ncdata
    } = options

    this.particlesCapacity = particlesNum ?? 300
    this.maxAge = maxAge ?? 60

    const { gridWidth, gridHeight, dataset } = parseNCData(ncdata)
    this._field = new Field({
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      dataset: dataset
    })
    // this._region = 
    // this._region = turf.convex()
    this._canvas = document.createElement('canvas')
    this._canvas.style.position = "absolute"
    this._canvas.style.top = "0px"
    this._canvas.style.left = "0px"
    this._renderer = new ParticleRenderer(this)
  }
 
  setEngine(engine: Viewer) {
    if (this._canvas === undefined) 
      return

    /** 目前只处理 Cesium */
    const canvasWidth = engine.canvas.width
    const canvasHeight = engine.canvas.height

    this._canvas.width = canvasWidth
    this._canvas.height = canvasHeight
    this._canvas.style.width = `${canvasWidth}px`
    this._canvas.style.height = `${canvasHeight}px`
    
    engine.canvas.parentElement?.appendChild(this._canvas)


    /** TODO */
    this._updateFunction = (particle: Particle) => {
      if (this._canvas === undefined || this._field === undefined) 
        return

      const widthScale = this._canvas.width / this._field.gridWidth
      const heightScale = this._canvas.height / this._field.gridHeight
      const scene = engine.scene
      const particlePosition = new Cartesian2(particle.x, particle.y)
      const worldPosition = scene.pickPosition(particlePosition)
      const lonlat = Cartographic.fromCartesian(worldPosition)

      const lonDegree = lonlat.longitude * CesiumMath.DEGREES_PER_RADIAN
      const latDegree = lonlat.longitude * CesiumMath.DEGREES_PER_RADIAN

      // 求交运算，若在不在范围内则生命值直接归max，重新生成点
      // const inRegion = booleanPointInPolygon(turf.point([lonDegree, latDegree]), this._region)
      // if (particle.age === 0 || inRegion === false) {
      //   recreateParticle(particle, this)
      //   return
      // }
      // 若在范围内，进入核心算法计算，先获取行列号
      const row = Math.floor(particle.y * heightScale)
      const col = Math.floor(particle.x * widthScale)
      // 然后从 field 里取四个点，进行点推导
      const grid = this._field.grid
      // const vectors = getRegionPoints(grid) // 行列平移，返回影响粒子点最近的向量
      // 插值
      // bilinearInterpolation2D(particle, ...vectors)
      // particle.move()

      // 移动后，要再一次判断是否在区域内+判断生命是否为0
      // checkParticleStatus(particle)
    }

    /** 创建并更新粒子 */
    createParticles(this)

    /** 渲染由此处触发，后续让 renderer 自己循环 */
    this._renderer.beginRender()
  }

  /**
   * 根据地图引擎的投影算法来更新粒子的生命，利用场来更新位置
   */
  update() {
    // preUpdate.emit();
    this.particles.forEach((particle: Particle) => {
      this._updateFunction(particle)
    })
  }

  /**
   * 渲染 layer 内的数据到 canvas
   * TODO
   */
  render() {
    // this.preRender.emit()
    const canvas = this._canvas
    if (canvas === undefined) 
      return

    const ctx = canvas.getContext('2d')
    this.particles.forEach((particle: Particle) => {
      // this._updateFunction(particle)
    })
  }

  remove() {
    this._renderer.stop()
    this._field = undefined
    this._canvas?.remove()
    this._canvas = undefined
  }
}

export default ParticleLayer