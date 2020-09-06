// 虚拟DOM元素的类，构建实例对象，用来描述DOM
class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

// 创建虚拟DOM，返回虚拟节点
function createElement(type, props, children) {
  return new Element(type, props, children);
}

// render方法可以将虚拟DOM转化成真实DOM
function render(domObj) {
  const el = document.createElement(domObj.type);

  for (let key in domObj.props) {
    setAttr(el, key, domObj.props[key]);
  }

  domObj.children.forEach(child => {
    child = child instanceof Element ? render(child) : document.createTextNode(child);
    el.append(child);
  })
  return el;
}

// 设置dom上的属性
function setAttr(node, key, value) {
  switch (key) {
    case 'value':
      if (node.tagName.toLowerCase() === 'input' ||
        node.tagName.toLowerCase() === 'textarea') {
        node.value = value;
      } else {
        node.setAttribute(key, value);
      }
      break;
    case 'style':
      node.style.cssText = value;
      break;
    default:
      node.setAttribute(key, value);
      break;
  }
}

// 最终渲染dom，插入到页面指定位置
function renderDom(el, target) {
  target.appendChild(el);
}

export {
  Element,
  createElement,
  render,
  setAttr,
  renderDom
}
