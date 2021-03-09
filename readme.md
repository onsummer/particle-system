netcdf -> n维格网数据，只解析与方向有关的两个数据：例如 193x181
   作为 gridWidth 和 gridHeight
   此网格的行列 (row, col) => [lon, lat] 可以取到经纬度以及数据值，只需索引 对应变量[row*col*...]
   
   grid <-[lon, lat]-> canvas 

   在 canvas 随机生成点
   -> [使用 CesiumAPI][使用MapboxAPI] 获取经纬度
   -> 若在范围内 [turf 判断]
   -> 转换到 grid 坐标（比例缩放），[双线性插值]其 uv 等变量值 
   -> 更新粒子 
   -> 判断更新后的粒子是否在范围内，是否生命已结束 
   -> 渲染粒子 requestAnimationFrame

   负责管理粒子可视化（渲染）的是（可视化动作） Layer：负责初始化生成 update、select 粒子
   负责管理渲染流水的是 Renderer：负责控制 Layer 的渲染循环 raf
   负责维护场的是 Field：负责生成向量场
   负责维护粒子数据的是 Particle

   Renderer <- Layer *- Particle[]
   
# 创建流程

创建 Layer
创建 Field
创建 Renderer
Renderer 执行 startRender()

对外暴露 API：ParticleLayer
使用方法：

``` js
const lyr = new ParticleLayer({
   dataset: ncdata,
   particlesNum: 1000
})

// for cesium
lyr.setEngine(viewer)

// for mapbox
lyr.setEngine(map)

// remove
lyr.remove()
```

当 setEngine() 成功后，粒子图层将开始渲染。
当 remove() 后，粒子图层结束渲染。


=======================

{x: -6.29, y: 2.45}	        	{x: 5.68, y: 3.42}

	      {x: -2.33, y: 1.15}

	                     	{x: 4.12, y: -2.77}
  {x: -5.94, y: -4.89}		


params:
pt, p1, p2, p3, p4
{x: -2.33, y: 1.15, v: 0}, {x: -6.29, y: 2.45, v: 1}, {x: 5.68, y: 3.42, v: 2}, {x: 4.12, y: -2.77, v: 3}, {x: -5.94, y: -4.89, v: 2}

without value:
pt, p1, p2, p3, p4
{x: -2.33, y: 1.15}, {x: -6.29, y: 2.45}, {x: 5.68, y: 3.42}, {x: 4.12, y: -2.77}, {x: -5.94, y: -4.89}


一个点在1、4号点的外围

外围点：{x: -10, y: 0}

	{x: -8.0336, y: 6.1536}



																					{x: 4.0793, y: 0.5787}


{x: -9.0849, y: -2.0879}


								{x: -4.3149, y: -4.833}



双线性插值点

{x: 17, y: 30, v: 2}				{x: 24, y: 30, v: 2}

				{x: 19, y: 25, v: 0}

{x: 17, y: 21, v: 2}				{x: 24, y: 21, v: 2}

{x: 19, y: 25, v: 0}, {x: 17, y: 30, v: 2}, {x: 24, y: 30, v: 2}, {x: 24, y: 21, v: 2}, {x: 17, y: 21, v: 2}