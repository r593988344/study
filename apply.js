
Function.prototype.myapply = function (thisArg) {
  // 调用 call 方法的必须是一个函数
  if (typeof this !== 'function') {
    throw TypeError('Error')
  }
  const fn = Symbol('fn')
  // 获取参数
  const arg = arguments[1]
  console.log(arguments);
  thisArg = thisArg || window
  // 将调用 call 的函数对象存入 thisArg 的 fn 属性中
  thisArg[fn] = this
  // 执行调用 call 方法的函数
  const result = thisArg[fn](...arg) // 此时 this 指向了 thisArg
  // 执行结束后删除该临时属性
  delete thisArg[fn]
  // 返回结果
  return result
}

const myObj = {
  number: 123
}

const fn = function (a, b, c) {
  console.log(this.number)
  console.log(a)
  console.log(b)
  console.log(c)
}

fn.myapply(myObj, [1, 2, 3])
