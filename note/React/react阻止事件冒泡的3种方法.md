# react阻止事件冒泡的3种方法

https://www.jianshu.com/p/0ff38a3ac40c

在实现一个常见的需求，也就是类似于下拉菜单，点击菜单以外的地方会隐藏菜单，这个过程中遇到了问题。

因为我是在document.body上添加原生点击事件，触发后关闭菜单。但是你点击菜单也会因为事件冒泡到body上的点击事件。

## 1. 关于react的事件机制

可以参考这篇文章 [https://juejin.cn/post/6955636911214067720](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.cn%2Fpost%2F6955636911214067720)

简单理解就是，react的事件都是合成事件，所以事件最后都是代理到document上面。（在react17及以后不再代理到document，而是react组件树到容器节点）

而你在合成事件内调用`e.stopPropagation()`，也只能阻止react到合成事件的冒泡触发，不能阻止你在document（或者容器节点）上绑定的原生事件。

用下面的例子就很容易理解

```jsx
import React, { useEffect, useRef } from 'react';
export default function Demo() {
    const appRef = useRef();
    const btnRef = useRef();

    useEffect(() => {
        window.addEventListener('click', function () {
            console.log('window click')
        })
        // v17 之前 合成事件 冒泡到 document 上
        document.addEventListener('click', function () {
            console.log('document click')
        })
        // v17 及之后 合成事件 冒泡到 根节点 上
        document.getElementById('root').addEventListener('click', function () {
            console.log('root click')
        })
        btnRef.current.addEventListener('click', function (e) {
            console.log('btn click');
            // 最好不要在这里阻止冒泡，会阻塞 合成事件 的执行哦（合成事件无法冒到跟节点）
            // e.stopPropagation();
        })
        appRef.current.addEventListener('click', function (e) {
            // button 的 原生事件 冒泡到这里，判断下 冒泡源 就可以模拟 阻止 源头向当前节点冒泡
            // 最好不要在这里阻止冒泡，会阻塞 合成事件 的执行哦（合成事件无法冒到跟节点）
            if (e.srcElement === appRef.current) {
                console.log('app click');
            }
        })
    }, []);

    function onBtnClick(e) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        console.log('react button click');
    }

    function onAppClick(e) {
        console.log('react app click');
    }

    return (
        <div className="App" ref={appRef} onClick={onAppClick}>
            <button ref={btnRef} onClick={onBtnClick}>按钮</button>
        </div>
    )
}

```

不添加任何阻止冒泡逻辑的时候，执行顺序下

```
btn click
app click
react button click
react app click
document click
window click
```

如果我们在按钮的点击事件中添加react阻止冒泡的逻辑

```jsx
...
function onBtnClick(e) {
  e.stopPropagation();
  console.log('react button click');
}
...
```

可以发现，react合成事件的冒泡被阻止了。所以，react app click没有被打印，但是原生事件没有阻止，仍然打印

这说明react事件中`e.stopPropagation()`只能阻止react的合成事件的冒泡。

```
btn click
app click
react button click
document click
```

然后我们换成`e.nativeEvent.stopImmediatePropagation()`

```jsx
  function onBtnClick(e: any) {
    e.nativeEvent.stopImmediatePropagation()
    console.log('react button click')
  }
```

执行结果如下,可以发现这个api就能达到我们的要求，做到不触发document上的点击事件。

```
btn click
app click
react button click
react app click
```

## 2. stopImmediatePropagation

通过上面的例子，我们就能大致了解这个函数的作用

https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopImmediatePropagation

```html
<!DOCTYPE html>
<html>
    <head>
        <style>
            p { height: 30px; width: 150px; background-color: #ccf; }
            div {height: 30px; width: 150px; background-color: #cfc; }
        </style>
    </head>
    <body>
        <div>
            <p>paragraph</p>
        </div>
        <script>
            const p = document.querySelector('p')
            p.addEventListener("click", (event) => {
              alert("我是 p 元素上被绑定的第一个监听函数");
            }, false);

            p.addEventListener("click", (event) => {
              alert("我是 p 元素上被绑定的第二个监听函数");
              event.stopImmediatePropagation();
              // 执行 stopImmediatePropagation 方法，阻止 click 事件冒泡，并且阻止 p 元素上绑定的其他 click 事件的事件监听函数的执行。
            }, false);

            p.addEventListener("click",(event) => {
              alert("我是 p 元素上被绑定的第三个监听函数");
              // 该监听函数排在上个函数后面，该函数不会被执行
            }, false);

            document.querySelector("div").addEventListener("click", (event) => {
              alert("我是 div 元素，我是 p 元素的上层元素");
              // p 元素的 click 事件没有向上冒泡，该函数不会被执行
            }, false);
        </script>
    </body>
</html>
```

`Event` 接口的 `stopImmediatePropagation()` 方法阻止监听同一事件的其他事件监听器被调用。

如果多个事件监听器被附加到相同元素的相同事件类型上，当此事件触发时，它们会按其被添加的顺序被调用。如果在其中一个事件监听器中执行 `stopImmediatePropagation()` ，那么剩下的事件监听器都不会被调用。

也就是说这个事件会阻止后续添加的事件的执行。

因此当点击事件执行，然后冒泡到document的时候，会阻止document上其他函数的执行。所以达成了我们想要的效果。

## 3. 总结

我们可以得出以下3种方法在react里阻止事件冒泡

1. 通过原生事件阻止事件冒泡，阻止DOM原生事件。

   ```jsx
   btnRef.current.addEventListener('click', function (e) {
    e.stopPropagation();
       console.log('btn click');
   })
   ```

2. 使用`e.nativeEvent.stopImmediatePropagation()`阻止document上同类事件的调用。

   ```jsx
   function onBtnClick(e) {
       // e.stopPropagation();
       e.nativeEvent.stopImmediatePropagation();
       console.log('react button click');
   }
   
   <button ref={btnRef} onClick={onBtnClick}>按钮</button>
   ```

3. 在window上绑定事件，因为react16把所有事件都代理到document，window的顺序在document之后，所以是可以阻止（react jsx事件回调里的`e.stopPropagation`只能阻止react在document上绑定的代理事件的冒泡）

## 4. 实践

第一条不实用，相当于我们在react里面，不用react的合成事件，而增加了原生代码的比例。

第三条实际上没有阻止到document上点击事件的触发，

因此还是用stopImmediatePropagation+stopPropagation的方式，这样能阻止react合成事件冒泡，又能阻止document上事件的执行。

因此我们最后可以编写下面的通用函数来阻止冒泡

```ts
import { SyntheticEvent } from 'react'
/**
 * 取消事件冒泡
 * @param e
 */
export default function cancelBubble(e: SyntheticEvent) {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
}
```

