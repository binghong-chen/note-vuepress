# CommonJS和ES6模块的区别

[https://juejin.cn/post/6844904067651600391](https://juejin.cn/post/6844904067651600391)

**CommonJS** ，到后来的**AMD**和**CMD**，再到今天的**ES6模块**化方案。

既然都是JS，**为什么还要使用两种模块化方案？**

## 为什么还要使用两种模块化方案？

CommonJS的 `require` 语法是同步的，当我们使用`require` 加载一个模块的时候，必须要等这个模块加载完后，才会执行后面的代码。

**NodeJS** 是服务端，使用 `require` 语法加载模块，一般是一个文件，只需要从本地硬盘中读取文件，它的速度是比较快的。

在浏览器端就不一样了，文件一般存放在服务器或者CDN上，如果使用同步的方式加载一个模块还需要由网络来决定快慢，可能时间会很长，这样浏览器很容易进入“假死状态”。所以才有了后面的**AMD**和**CMD**模块化方案，它们都是异步加载的，比较适合在浏览器端使用。

## 两个重大的差异

- CommonJS模块输出的是一个值的拷贝，ES6 模块输出的是值的引用；
- <font color=gold>CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。</font>不太理解

我们先来看第一个差异。

CommonJS输出的是值的拷贝，换句话说就是，一旦输出了某个值，如果模块内部后续的变化，影响不了外部对这个值的使用。具体例子：

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

然后我们在其它文件中使用这个模块：

```js
var mod = require('./lib');
console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

上面的例子充分说明了如果我们对外输出了`counter` 变量，就算后续调用模块内部的`incCounter` 方法去修改它的值，它的值依旧没有变化。

ES6模块运行机制完全不一样，JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚本真正执行的时候，再根据这个只读引用，到被加载的那个模块里去取值。

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

上面代码说明，ES6 模块`import`的变量`counter`是可变的，完全反应其所在模块`lib.js`内部的变化。

而第二个差异，也是为什么ES6模块这么受人欢迎的最大原因之一。我们知道CommonJS其实加载的是一个对象，这个对象只有在脚本运行时才会生成，而且只会生成一次，这个后面我们会具体解释。但是ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成，这样我们就可以使用各种工具对JS模块进行依赖分析，优化代码，而Webpack中的 `tree shaking` 和 `scope hoisting` 实际上就是依赖ES6模块化。

<font color=gold>然而uid-cpe中是 commonjs的:</font>

<img src="./assets/image-20230209001157547.png" alt="image-20230209001157547" style="zoom:50%;" />

## 循环加载（circular dependency）

**循环加载**指的是`a`脚本依赖了`b`脚本，而`b`脚本的执行又依赖了`a`脚本。在一个大型的项目中，一般依赖关系比较复杂，很容易出现循环依赖的情况，所以对于一个模块化方案，需要考虑这种情况。

### CommonJS的循环加载

想要搞清楚CommonJS的循环加载问题，首先我们要先大概了解下它的加载原理。CommonJS的一个模块，一般就是一个文件，使用`reqiure`第一次加载一个模块的时候，就会在内存中生成一个对象。大概长这个样子：

```js
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

上面的例子我们只列出了关键的几个属性，`id`就是模块名，`exports`是模块输出的各个接口，`loaded`属性表示模块是否执行完毕。以后再用到这个模块的时候，会直接从这个对象的`exports`属性里面取值。即使多次执行一个模块的`require`命令，它都只会在第一次加载时运行一次，后面都会从缓存中读取，除非[手动清除缓存](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F23685930%2Fclearing-require-cache)。

CommonJS模块的特性就是<font color=red>加载时执行</font>，当脚本被`reqiure`的时候，就会全部执行。<font color=red>一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。</font>我们看一个官方的例子，首先定义`a.js`如下：

```js
exports.done = false;
var b = require('./b.js'); // b.js 中 会将 a.js 卡在此处
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');
```

上面的代码，首先输出一个`done`变量，然后开始加载`b.js`。注意，此时`a.js`就会停在这里，等待`b.js`执行完，才会继续执行后面的代码。再定义`b.js`代码：

```js
exports.done = false;
var a = require('./a.js'); // 会将 a.js 卡住 然后 优先 执行完 b.js
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```

跟`a.js`类似，`b.js`导出一个变量后，在第二行就开始加载`a.js`，发生了循环依赖。然后系统就会去内存对象的`exports` 中取`done`变量的值，可是因为`a.js`没有执行完，所以只取到刚开始输出的值`false`。接着`b.js`继续执行后面的代码，执行完毕后，再把执行权交还给`a.js` ，执行完后面剩下的代码。为了验证这个过程，新建一个`main.js`：

```js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
```

最后执行`main.js`结果为：

```js
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```

由于 CommonJS 模块遇到循环加载时，输出的是当前<font color=red>已经执行那部分的值，而不是代码全部执行后的值</font>，两者可能会有差异。所以，输入变量的时候，必须非常小心。

### ES6中的循环加载

ES6 模块是<font color=red>动态引用</font>，如果使用`import`加载一个变量，<font color=red>变量不会被缓存</font>，真正取值的时候就能取到最终的值。可以看下下面这个例子：

```js
// even.js
import { odd } from './odd'
export var counter = 0;
export function even(n) {
  counter++;
  return n === 0 || odd(n - 1);
}

// odd.js
import { even } from './even';
export function odd(n) {
  return n !== 0 && even(n - 1);
}
```

上面代码中，`even.js`里面的函数`even`有一个参数`n`，只要不等于 0，就会减去 1，传入加载的`odd()`。`odd.js`也会做类似操作。

运行上面这段代码，结果如下：

```javascript
> import * as m from './even.js';
> m.even(10);
true
> m.counter
6
```

上面代码中，参数`n`从 10 变为 0 的过程中，`even()`一共会执行 6 次，所以变量`counter`等于 6。在这个例子中，我们可以看到，`even.js`中输出的`counter变量值会随着模块内部的变化而变化。

因为两个模块化方案的加载方式的不同，导致它们对待循环加载的不同处理。

## 它们还有什么不同之处

它们当然还有一些其它差异，在这里我们直接列出。首先，就是`this`关键词，在ES6模块顶层，`this`指向`undefined`；而CommonJS模块的顶层的`this`指向当前模块。其次，在ES6模块中可以直接加载CommonJS模块，但是只能整体加载，不能加载单一的输出项。

```js
// 正确
import packageMain from 'commonjs-package';

// 报错
import { method } from 'commonjs-package';
```

Node.js 对 ES6 模块的处理就比较麻烦了，因为它有自己的 CommonJS 模块规范，与 ES6 模块格式是不兼容的。目前两个模块方案是分开处理的，从 v13.2 版本开始，Node.js 已经默认打开了 ES6 模块支持。NodeJS要求ES6模块使用`mjs`后缀文件名，只要NodeJS遇到`mjs`结尾的文件，就认定是ES6模块。除了修改文件的后缀，当然也可以在项目的`package.json`文件中，指定`type`字段为`module`。

```json
{
   "type": "module"
}
```

尽管如此，`require`命令不能加载`.mjs`文件，会报错，只有`import`命令才可以加载`.mjs`文件。反过来，`.mjs`文件里面也不能使用`require`命令，必须使用`import`，所以在平时开发当中，ES6 模块与 CommonJS 模块尽量不要混用。

### 我的试验

Node.js 加载 ES6

```js
// es6
export const value = 123;

export default {
  value: 100,
  hi() {
    console.log("hi");
  },
};


// node.js
(async function () {
  var es6 = await import("es6-package");
  console.log({ es6 });
  const { value, default: defaultValue } = es6;
  console.log({ value, defaultValue });
  console.log(typeof es6) // 'object'
})();

// 输出
/*
{
  es6: [Module: null prototype] {
    default: { value: 100, hi: [Function: hi] },
    value: 123
  }
}
{ value: 123, defaultValue: { value: 100, hi: [Function: hi] } }
object
*/
```

ES6 加载 CommonJS

```js
// commonjs
exports.name = "fores6";

module.exports = {
  value: 100,
  hello() {
    console.log("hello");
  },
};


// es6
import cjs from 'commonjs-package'

/*
CommonJS modules can always be imported via the default export, for example using:
import pkg from 'commonjs-package';
const { value } = pkg;
*/
// import { value } from 'commonjs-package'

console.log(cjs)

const { value } = cjs
console.log(value)

// 输出
// { value: 100, hello: [Function: hello] }
// 100
```



## 总结

写到这里，本文也就基本结束了。我们总结一下文中涉及到的内容：

- 因为**CommonJS**的`require`语法是同步的，所以就导致了**CommonJS**模块规范只适合用在服务端，而ES6模块无论是在浏览器端还是服务端都是可以使用的，但是在服务端中，还需要遵循一些特殊的规则才能使用 ；
- **CommonJS** 模块输出的是一个值的拷贝，而ES6 模块输出的是值的引用；
- **CommonJS** 模块是运行时加载，而ES6 模块是编译时输出接口，使得对JS的模块进行静态分析成为了可能；
- 因为两个模块加载机制的不同，所以在对待循环加载的时候，它们会有不同的表现。**CommonJS**遇到循环依赖的时候，只会输出已经执行的部分，后续的输出或者变化，是不会影响已经输出的变量。而ES6模块相反，使用`import`加载一个变量，变量不会被缓存，真正取值的时候就能取到最终的值；
- 关于模块顶层的`this`指向问题，在**CommonJS**顶层，`this`指向当前模块；而在ES6模块中，`this`指向`undefined`；
- 关于两个模块互相引用的问题，在ES6模块当中，是支持加载**CommonJS**模块的。但是反过来，**CommonJS**并不能`require`ES6模块，在NodeJS中，两种模块方案是分开处理的。<font color=red>可以用 await import('xxx')</font>

### Reference

[Module 的加载实现](https://link.juejin.cn?target=https%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fmodule-loader)

[js模块化编程之彻底弄懂CommonJS和AMD/CMD](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fchenguangliang%2Fp%2F5856701.html)

[ECMAScript Modules](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fapi%2Fesm.html%23esm_ecmascript_modules)

