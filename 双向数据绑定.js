// defineProperty 版本
const data = {
  text: '222'
}
const input = document.getElementById('input')
const span = document.getElementById('span')
// 数据劫持
Object.defineProperty(data, 'text', {
  set(newVal) {
    // 当 data.text 改变时，对修改视图
    input.value = newVal
    span.innerHTML = newVal
  }
})
// 视图更改，修改数据
input.addEventListener('change', (e) => {
  data.text = e.target.value
})

// proxy 版本
// 数据
const data = {
  text: 'default'
};
const input = document.getElementById('input');
const span = document.getElementById('span');
// 数据劫持
const handler = {
  set(target, key, value) {
    target[key] = value;
    // 数据变化 --> 修改视图
    input.value = value;
    span.innerHTML = value;
    return value;
  }
};
const proxy = new Proxy(data, handler);

// 视图更改 --> 数据变化
input.addEventListener('keyup', function(e) {
  proxy.text = e.target.value;
});
