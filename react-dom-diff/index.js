// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
//
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

import { createElement, render, renderDom } from "./element";
// +++ 引入diff和patch方法
import diff from './diff';
import patch from './patch';
// 创建虚拟DOM
const virtualDom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['周杰伦']),
  createElement('li', { class: 'item' }, ['王力宏']),
  createElement('li', { class: 'item' }, ['林俊杰']),
  createElement('li', { class: 'item' }, ['蔡依林']),
])
// 虚拟DOM转换真实DOM
const el = render(virtualDom)

// 渲染
renderDom(el, document.getElementById('root'));

// 创建另一个新的虚拟DOM
let virtualDom2 = createElement('ul', {class: 'list-group'}, [
  createElement('li', {class: 'item active'}, ['七里香']),
  createElement('li', {class: 'item'}, ['一千年以后']),
  createElement('li', {class: 'item'}, ['需要人陪'])
]);
// diff一下两个不同的虚拟DOM
let patches = diff(virtualDom, virtualDom2);
console.log(patches);
// 将变化打补丁，更新到el
setTimeout(() => {
  patch(el, patches);
}, 2000)
