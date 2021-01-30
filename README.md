# 学习react-fiber实现原理

### 虚拟DOM长啥样

![20210129191736](https://cdn.jsdelivr.net/gh/Orime112/picbed/20210129191736.png)

- 更直观一点

![20210129191826](https://cdn.jsdelivr.net/gh/Orime112/picbed/20210129191826.png)

- 虚拟DOM就是用JS对象来描述DOM结构，[详见文件](./src/element.js)

### raf概念以及应用
- raf函数中的callback会在每一帧开始之前执行

* [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)回调函数会在绘制之前执行
* `requestAnimationFrame(callback)` 会在浏览器每次重绘前执行 callback 回调, 每次 callback 执行的时机都是浏览器刷新下一帧渲染周期的起点上
* `requestAnimationFrame(callback)` 的回调 callback 回调参数 timestamp 是回调被调用的时间，也就是当前帧的起始时间
* `rAfTime performance.timing.navigationStart + performance.now() 约等于 Date.now()`

### ric概念以及应用

* 我们希望快速响应用户，让用户觉得够快，不能阻塞用户的交互
* [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应
* 正常帧任务完成后没超过16 ms,说明时间有富余，此时就会执行 requestIdleCallback 里注册的任务
* `requestAnimationFrame`的回调会在每一帧确定执行，属于高优先级任务，而`requestIdleCallback`的回调则不一定，属于低优先级任务

- requestIdleCallback执行效果
![](https://cdn.jsdelivr.net/gh/Orime112/picbed/img/20210130112101.png)

![](https://cdn.jsdelivr.net/gh/Orime112/picbed/img/20210130112921.png)

### Fiber阶段
- 每次渲染有两个阶段：Reconciliation(协调render阶段)和Commit(提交阶段)
  - 协调阶段: 可以认为是 Diff 阶段, 这个阶段可以被中断, 这个阶段会找出所有节点变更，例如节点新增、删除、属性变更等等, 这些变更React 称之为副作用(Effect)
  - 提交阶段: 将上一个阶段计算出来的需要处理的副作用(Effects)一次性执行了。这个阶段必须同步执行，不能被打断
