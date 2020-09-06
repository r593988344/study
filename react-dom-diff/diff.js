function diff(oldTree, newTree) {
  // 声明变量 patches 来存放补丁对象
  const patches = {};
  // 第一次比较应该是树的第0个索引
  let index = 0;
  // 递归树 比较后的结果放到补丁里
  walk(oldTree, newTree, index, patches);
  return patches;
}

function walk(oldTree, newTree, index, patches) {
  const current = [];
  // 没有 newTree 为删除节点
  if (!newTree) {
    current.push({
      type: 'REMOVE',
      index
    })
    // 判断是否为文本节点
  } else if (isString(oldTree) && isString(newTree)) {
    if (oldTree !== newTree) {
      current.push({
        type: 'TEXT',
        text: newTree
      })
    }
  } else if (oldTree.type === newTree.type) {
    // 判断属性是否有修改
    let attr = diffAttr(newTree.props, oldTree.props);
    if (Object.keys(attr).length > 0) {
      current.push({
        type: 'ATTR',
        attr
      })
      // 如果有子节点，遍历子节点
      diffChildren(oldTree.children, newTree.children, patches);
    }
  } else {    // 说明节点被替换了
    current.push({ type: 'REPLACE', newTree});
  }
  // 当前元素确实有补丁存在
  if (current.length) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = current;
  }
}

function isString(obj) {
  return typeof obj === 'string'
}

function diffAttr(newAttrs, oldAttrs){
  let patch = {}
  for(let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key]; // 有可能还是undefined
    }
  }
  for (let key in newAttrs) {
    // 老节点没有新节点的属性
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key];
    }
  }
  // 返回所有不同的 attrs
  return patch;
}

// 所有都基于一个序号来实现
let num = 0;

function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++num, patches);
  });
}

export default diff;
