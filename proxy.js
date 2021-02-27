const watch = (obj, onChange) => {
  const handler = {
    get(target, property, receiver) {
      try {
        // 如果target[property]为
        return new Proxy(target[property], handler)
      } catch (err) {
        return Reflect.get(target, property, receiver)
      }
    },
    // 定义或修改对象属性
    defineProperty(target, property, descriptor) {
      onChange('define', property);
      Reflect.defineProperty(target, property, descriptor)
    },
    // s删除对象属性
    deleteProperty(target, property) {
      onChange('delete', property)
      Reflect.deleteProperty(target, property)
    }
  }
  return new Proxy(obj, handler);
}

const obj1 = {
  a: 1,
  b: 2,
  c: {
    d: 3
  }
}

const w = watch(obj1, (op, p) => {
  console.log(`修改了:${op}属性，修改为:${p}`)
})

w.a = 10;
