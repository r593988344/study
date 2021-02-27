const deepClone = (obj) => {
  // 用于循环引用去重
  const uniqueList = [];
  const root = {};
  const loopList = [{
    parent: root,
    key: undefined,
    data: obj,
  }]
  while (loopList.length) {
    const node = loopList.pop();
    const {data, parent, key} = node;
    let res = parent;
    // 如果有子对象，则创建新的对象并赋值
    if (key !== undefined) {
      res = parent[key] = {};
    }
    const uniqueData = uniqueList.find(item => item.source === data);
    if (uniqueData) {
      parent[key] = data;
      continue;
    }
    uniqueList.push({
      target: res,
      source: data,
    })
    for(let key in data) {
      if (data.hasOwnProperty(key)) {
        if (Object.prototype.toString.call(data[key]) === '[object Object]') {
          loopList.push({
            parent: res,
            key,
            data: data[key],
          })
        } else {
          res[key] = data[key];
        }
      }
    }
  }
  return root;
}
const cc = {d: 3};
const aa = { a: 1, b: { c: 2 }, e: cc, f: cc };
const bb = deepClone(aa);
console.log(bb);
console.log(aa === bb);
console.log(aa.b === bb.b);
