function asyncMain(fn) {
  return function () {
    const self = this
    const arg = arguments
    return new Promise(function (reslove, reject) {
      // 获取迭代器实例
      const generator = fn.apply(self, arg)
      // 执行下一步
      function _next(value) {
        asyncNextStep(generator, reslove, reject, 'next', value, _next, _throw)
      }
      // 抛出异常
      function _throw(error) {
        asyncNextStep(generator, reslove, reject, 'throw', error, _next, _throw)
      }
      // 函数首次执行调用
      _next(undefined)
    })
  }
}

function asyncNextStep(generator, reslove, reject, type, arg, _next, _throw) {
  try {
    // 执行 generator 的 next()
    var info = generator[type](arg)
    var value = info.value
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    //迭代完成
    reslove(value)
  } else {
    // 递归调用 _next 直到返回 info.done = true
    Promise.resolve(value).then((val) => _next(val));
  }
}

function getNum(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num + 1)
    }, 1000)
  })
}

const asyncFunc = asyncMain(function* () {
  const f1 = yield getNum(1)
  const f2 = yield getNum(f1)
  return f2
  // 输出3
})

asyncFunc().then(res => {
  console.log(res);
})
