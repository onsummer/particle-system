function test(
  data: number[],
  lfId: number,
  rgId: number,
  mId: number): { result: boolean, boundary: number[] } {

  const left = data[lfId]
  const right = data[rgId]
  const mid = data[mId]

  if (testNumber < left || testNumber > right) {
    return {
      result: false,
      boundary: [-1, -1]
    }
  }

  if (Math.abs(rgId - lfId) <= 1) {
    return {
      result: true,
      boundary: [lfId, rgId]
    }
  }

  // 左区
  if (testNumber > left && testNumber < mid) {
    const newMidId = Math.floor((mId - lfId) / 2) + lfId
    return test(data, lfId, mId, newMidId)
  }
  // 右区
  else (testNumber > mid && testNumber < right) {
    const newMidId = Math.floor((rgId - mId) / 2) + mId
    return test(data, mId, rgId, newMidId)
  }
}

let testNumber = 0

/**
 * 从数据列中寻找包裹着待检索数字的两个数字的序号
 * 
 *  例如，从 [1,2,3,5,7] 中寻找 4 的包裹数字的序号，即 2、3
 * 
 * @param dataArray 数据列
 * @param findNumber 检索的数字
 */
export function binarySearch(
  dataArray: number[],
  findNumber: number): { result: boolean, boundary: number[] } {
    
  const leftIndex = 0
  const rightIndex = dataArray.length - 1
  const midIndex = Math.floor((rightIndex - leftIndex) / 2)
  testNumber = findNumber

  return test(dataArray, leftIndex, rightIndex, midIndex)
}
