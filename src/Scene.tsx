import React, { useEffect, useRef } from 'react'
import { Viewer } from 'cesium'
import 'Scene.css'

const Scene = () => {
  let viewer = undefined

  useEffect(() => {
    viewer = new Viewer(document.getElementById('cesium-container') as HTMLElement)
  }, [])

  return <div id={"cesium-container"}>
  </div>
}

export default Scene