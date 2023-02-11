# CommonJS规范

[https://javascript.ruanyifeng.com/nodejs/module.html](https://javascript.ruanyifeng.com/nodejs/module.html)

## 1. 概述

Node 应用由模块组成，采用 CommonJS 模块规范。

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

```js
// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};
```

上面代码中，变量`x`和函数`addX`，是当前文件`example.js`私有的，其他文件不可见。

如果想在多个文件分享变量，必须定义为`global`对象的属性。

```js
global.warning = true;
```

上面代码的`warning`变量，可以被所有文件读取。当然，这样写法是不推荐的。

CommonJS规范规定，每个模块内部，`module`变量代表当前模块。这个变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。

```js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

上面代码通过`module.exports`输出变量`x`和函数`addX`。

`require`方法用于加载模块。

```js
var example = require('./example.js');

console.log(example.x);	// 5
console.log(example.addX(1));	// 6
```

`require`方法的详细解释参见《Require命令》一节。

CommonJS模块的特点如下。

> - 所有代码都运行在模块作用域，不会污染全局作用域。
> - 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
> - 模块加载的顺序，按照其在代码中出现的顺序。

## 2. module 对象

Node内部提供一个`Module`构建函数。所有模块都是`Module`的实例。

```js
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  // ...
}
```

每个模块内部，都有一个`module`对象，代表当前模块。它有以下属性。

> - `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
> - `module.filename` 模块的文件名，带有绝对路径。
> - `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
> - `module.parent` 返回一个对象，表示调用该模块的模块。
> - `module.children` 返回一个数组，表示该模块要用到的其他模块。
> - `module.exports` 表示模块对外输出的值。

下面是一个示例文件，最后一行输出module变量。

```js
// example.js
var jquery = require('jquery');
exports.$ = jquery;
console.log(module);
```

执行这个文件，命令行会输出如下信息。

```js
{ id: '.',
  exports: { '$': [Function] },
  parent: null,
  filename: '/path/to/example.js',
  loaded: false,
  children:
   [ { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  paths:
   [ '/home/user/deleted/node_modules',
     '/home/user/node_modules',
     '/home/node_modules',
     '/node_modules' ]
}
```

如果在命令行下调用某个模块，比如`node something.js`，那么`module.parent`就是`null`。如果是在脚本之中调用，比如`require('./something.js')`，那么`module.parent`就是调用它的模块。利用这一点，可以判断当前模块是否为入口脚本。

```js
if (!module.parent) {
  // ran with `node something.js`
  app.listen(8088, function() {
    console.log('app listening on port 8088');
  })
} else {
  // used with `require('./something.js')`
  module.exports = app;
}
```

### 2.1 module.exports 属性

`module.exports`属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取`module.exports`变量。

```js
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

setTimeout(function() {
  module.exports.emit('ready');
}, 1000);
```

上面模块会在加载后1秒后，发出ready事件。其他文件监听该事件，可以写成下面这样。

```js
var a = require('./a');
a.on('ready', function() {
  console.log('module a is ready');
});
```

### 2.2 exports 变量

为了方便，Node为每个模块提供一个exports变量，指向module.exports。这等同在每个模块头部，有一行这样的命令。

```js
var exports = module.exports;
```

造成的结果是，在对外输出模块接口时，可以向exports对象添加方法。

```js
exports.area = function (r) {
  return Math.PI * r * r;
};

exports.circumference = function (r) {
  return 2 * Math.PI * r;
};
```

注意，不能直接将exports变量指向一个值，因为这样等于切断了`exports`与`module.exports`的联系。

```
exports = function(x) {console.log(x)};
```

上面这样的写法是无效的，因为`exports`不再指向`module.exports`了。

下面的写法也是无效的。

```js
exports.hello = function() {
  return 'hello';
};

module.exports = 'Hello world';
```

上面代码中，`hello`函数是无法对外输出的，因为`module.exports`被重新赋值了。

这意味着，如果一个模块的对外接口，就是一个单一的值，不能使用`exports`输出，只能使用`module.exports`输出。

## 3. AMD 规范 与 CommonJS 规范 的 兼容性

CommonJS规范加载模块是<font color=red>同步</font>的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。

```js
define(['package/lib'], function(lib) {
  function foo() {
    lib.log('hello world!');
  }
  
  return {
    foo: foo
  };
});
```

AMD规范允许输出的模块兼容CommonJS规范，这时`define`方法需要写成下面这样：

```js
define(function (require, exports, module) {
  var someModule = require('someModule');
  var anotherModule = require('anotherModule');
  
  someModule.doTehAwesome();
  anotherModule.doMoarAwesome();
  
  exports.asplode = function () {
    someModule.doTehAwesome();
    anotherModule.doMoarAwesome();
  };
});
```



## 4. require 命令

### 4.1 基本用法

### 4.2 加载规则

### 4.3 目录的加载规则

### 4.4 模块的缓存

### 4.5 环境变量 NODE_PATH

### 4.6 模块的循环加载

### 4.7 requie.main

## 5. 模块的加载机制

### 5.1 require 的内部处理流程

## 6. 参考连接

