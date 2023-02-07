# setState

https://juejin.cn/post/7182382408807743548

## 自动批处理

在react17中，只有react事件会进行批处理，原生js事件、Promise、setTimeout、setInterval不会

在react18中，将所有事件都进行批处理，即多次setState会被合并成1次执行，提高了性能，在数据层，将多个状态更新合并成一次处理（在视图层，将多次渲染合并成一次渲染）

## 同步 or 异步

setState是一个异步方法，但是在setTimeout/setInterval等定时器里逃脱了React对它的掌控，变成了同步方法

实现机制类似于vue的$nextTick和浏览器的事件循环机制，每个setState都会被react加入到任务队列，多次对同一个state使用setState只会返回最后一次的结果，因为它不是立即就更新，而是先放在队列中，等时机成熟再执行批量更新。React18以后，使用了createRoot api后，所有setState都是异步批量执行的

https://juejin.cn/post/7061588533214969892

setState本身代码的执行肯定是同步的，这里的异步是指是多个state会合成到一起进行批量更新。同步还是异步取决于它被调用的环境。

- 如果setState在React能够控制的范围被调用，它就是**异步**的。比如**合成事件处理函数，生命周期函数**，此时会进行批量更新，也就是将状态合并后再进行DOM更新。
- 如果setState在原生JavaScript控制的范围内被调用，它就是**同步**的。比如原生事件处理函数，定时器回调函数，Ajax回调函数中，此时setState被调用后会立即更新DOM。