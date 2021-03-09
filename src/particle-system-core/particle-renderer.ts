//#region 
/*
  说明
    renderer 内置在 layer 中（因为此例是单layer应用）
    后续若要做多 layer 应用，则需要考虑一个类似 map/scene 一样的东西，renderer 则集成到它们里面

    第一次触发渲染器的渲染函数，是由 layer 触发的，后续则由渲染函数里的 rAF 自己跑。
 */
//#endregion

import ParticleLayer from "./particle-layer"

class ParticleRenderer {

  layer: ParticleLayer
  _isRender: boolean
  _renderHandler: number | undefined

  constructor(layer: ParticleLayer) {
    this.layer = layer
    this._isRender = false
  }

  beginRender() {
    this._isRender = true
    const render = (time: any) => {
      if (this._isRender === false) {
        cancelAnimationFrame(this._renderHandler!)
        return
      }

      const layer = this.layer

      layer.update()
      layer.render()

      this._renderHandler = requestAnimationFrame(render)
    }
     
    this._renderHandler = requestAnimationFrame(render)
  }

  stop() {
    this._isRender = false
  }
}

export default ParticleRenderer