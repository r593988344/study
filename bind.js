Function.prototype.myBind = function (thisArg) {
  // 绑定的 this 必须为 function
  if (typeof this !== 'function') {
    throw TypeError('Error')
  }
  // 保存 this
  const self = this
  // 获取参数 传递给调用者
  const arg = Array.prototype.splice.call(arguments, 1)
  // 一个空函数保存原函数的 prototype
  const epFn = function () {}
  // 箭头函数没有 prototype
  // 箭头函数的 this 永远指向它所在的作用域
  if (this.prototype) {
    epFn.prototype = this.prototype
  }
  // 需要被返回的绑定后的函数
  const bound = function () {
    return self.apply(
      // 判断是否通过 new 来调用 bound
      // 函数作为构造函数用 new 关键字调用时，不应该改变其 this 指向，因为 new绑定 的优先级高于 显示绑定 和 硬绑定
      this instanceof epFn ? this : thisArg,
      // 合并参数
      arg.concat(Array.prototype.splice.call(arguments))
    )
  }
  // 修改绑定函数的原型指向,使其指向原函数
  bound.prototype = new epFn()
  return bound
}
