Async/Await就是一个自执行的generate函数。利用generate函数的特性把异步的代码写成“同步”的形式。

```javascript
var fetch = require('node-fetch');

function* gen(){  // 这里的*可以看成 async
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);  // 这里的yield可以看成 await
  console.log(result.bio);
}

function run(gen) {
  const g = gen();
  function next(data) {
    const res = g.next(data);
    // 深度递归，只要 `Generator` 函数还没执行到最后一步，`next` 函数就调用自身
    if (res.done) return res.value;
    res.value.then(function(data) {
      next(data);
    });
  }
  next();
}

run(gen)
```
