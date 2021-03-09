export const randomArray = (count = 100, zoom = [0, 100]) => {
  const arr = []
  const _zoom = zoom[1] - zoom[0]
  for(let i = 0; i<count; i++) {
    arr.push(zoom[0] + Math.random() * _zoom)
  }
  return arr
}