import { Element, render, setAttr } from "./element";

let allPatches;
let index = 0; // 默认哪个需要打补丁

function patch(node, patches) {
  allPatches = patches;

  walk(node)
}

function walk(node) {
  let current = allPatches[index++];
  let childNodes = node.childNodes;

  // 先深度优先遍历递归子节点
  childNodes.forEach(child => {
    walk(child);
  })
  if (current) {
    doPatch(node, current);
  }
}

function doPatch(node ,patches) {
  // 遍历所有的补丁
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTR':
        for (let key in patch.attr) {
          let value = patch.attr[key];
          if (value) {
            setAttr(node, key, value);
          } else {
            node.removeAttribute(key);
          }
        }
        break;
      case 'TEXT':
        node.textContent = patch.text;
        break;
      case 'REPLACE':
        let newNode = patch.newTree;
        newNode = newNode instanceof Element ? render(newNode) : document.createTextNode(newNode.type);
        node.parentNode.replaceChild(newNode ,node);
        break;
      case 'REMOVE':
        node.parentNode.removeChild(node);
        break;
      default:
        break;
    }
  })
}

export default patch;
