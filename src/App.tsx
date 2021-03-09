import axios from 'axios'
import { Viewer } from 'cesium'
import React, { useEffect, useRef } from 'react'
import NetCDFReader from './netcdf'
import ParticleLayer from './particle-system-core/particle-layer'

import '../node_modules/cesium/Source/Widgets/widgets.css'

const App = () => {
  
  let viewer: Viewer
  const handler = (): void => {
    async function fetchData(url: string) {
      const { data } = await axios(url, {
        responseType: 'arraybuffer'
      })
      const reader = new NetCDFReader(data)
      const layer = new ParticleLayer({
        maxAge: 60,
        particlesNum: 1000,
        ncdata: reader
      })
      layer.setEngine(viewer)
    }

    fetchData(`grid.nc`)
  }

  const div = useRef<HTMLDivElement>(null)
  useEffect(() => {
    viewer = new Viewer(div.current as Element)
  }, [])

  return <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    margin: '0px',
    padding: '0px',
    width: '100vw',
    height: '100vh',
    flexDirection: 'column'
  }}>
    <button onClick={handler} style={{
      width: "30vw",
      height: "10vh",
      fontSize: "3rem"
    }}>
      测试
    </button>
    <div ref={div} id={"cesium-container"} style={{width: "1000px", height: "700px"}}></div>
  </div>
}

export default App
