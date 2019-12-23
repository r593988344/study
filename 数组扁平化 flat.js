const arr = [1,2,3,[1,2,3,[1,2,3]]]
// 递归
function flat(arr) {

  let arrRes = []
  arr.forEach(item => {
    if (Array.isArray(item)) {
      arrRes = arrRes.concat(arguments.callee(item))
    } else {
      arrRes.push(item)
    }
  })
  return arrRes
}
console.log(flat(arr));

// reduce实现
function flatReduce(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatReduce(cur) : cur)
  }, [])
}
console.log(flatReduce(arr));

// 使用栈
function flatStack(arr) {
  const curArr = [].concat(arr)
  const resArr = []
  while (curArr.length) {
    const val = curArr.pop()
    if (Array.isArray(val)) {
      curArr.push(...val)
    } else {
      resArr.unshift(val)
    }
  }
  return resArr
}
console.log(flatStack(arr));
