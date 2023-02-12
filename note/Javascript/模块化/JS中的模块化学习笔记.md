# JS中的模块化学习笔记

`module`	`exports`	`module.exports` `CommonJS` `ES6` `AMD` `require` `import` `export` `define` `from` `default`

/Users/chenbinghong/Study/FrontEnd/js-module-demo/demo1.js

```js
console.log(exports)
console.log(module)
console.log(module.exports)
console.log(module.exports === exports)
```

```sh
{}
Module {
  id: '.',
  path: '/Users/chenbinghong/Study/FrontEnd/js-module-demo',
  exports: {},
  filename: '/Users/chenbinghong/Study/FrontEnd/js-module-demo/demo1.js',
  loaded: false,
  children: [],
  paths: [
    '/Users/chenbinghong/Study/FrontEnd/js-module-demo/node_modules',
    '/Users/chenbinghong/Study/FrontEnd/node_modules',
    '/Users/chenbinghong/Study/node_modules',
    '/Users/chenbinghong/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
{}
true
```

## CommonJS ES6 AMD 导入导出、互相引用

### CommonJS

#### CommonJS 导入导出写法

```js
// 导出
module.exports = {
  value: 100,
  hello() {
    console.log("hello");
  },
};
// 导入
require('./xxx.js')
```

#### CommonJS 加载 ES6

```js
// 加载 ES6
(async function () {
  // Directory import is not supported resolving ES modules imported
  // var ES6 = await import("./ES6");
  var ES6 = await import("./ES6/index.js"); // 需要写全路径
  const { name, default: defaultValue } = ES6;
  console.log({ value, defaultValue });
})();
```

#### CommonJS 加载 AMD

```sh
npm install amd-loader
```

```js
// 加载 AMD
var AMD = require("./AMD");	// 可以省略 后缀 和 文件夹导入（省略比如 index.js 的入口文件）
console.log(AMD)
```

### ES6

#### ES6 导入导出写法

```js
// 导出
exports const name = 'ES6';

exports default {
  value: 100,
  hello() {
    console.log("hello");
  },
};

// 导入
import { name }, ES6 from './xxx.js'
```

#### node 运行 ES6

需要在`package.json`中配置

```json
{
  "type": "module"
}
```

#### ES6 加载 CommonJS

可以直接加载，但是不能直接`import`解析值

```js
// CommonJS modules can always be imported via the default export, for example using:
// import { value } from './common.js'

import commonjs from 'common.js'
const { value } = commonjs
```

#### ES6 加载 AMD

需要安装`amd-loader`

```sh
npm install amd-loader
```

```js
import "amd-loader";

// SyntaxError: The requested module './amd.js' does not provide an export named 'default'
// 因为 `package.json` 的 type 是 module 统计目录下的 amd.js 被视为 es6 的
// import amd from "./amd.js";

// 需要指全路径
// import amdDemo1 from "../amd/demo1";   // ERR_UNSUPPORTED_DIR_IMPORT
// import amdDemo1 from "../amd/demo1/index";  // ERR_MODULE_NOT_FOUND
import amdDemo1 from "../amd/demo1/index.js";
```

### AMD

#### AMD 定义与依赖写法

```js
// package/lib.js
define(function(require, exports, module){
    // module.exports = console
    return console
})


// index.js
define(["./package/lib"], function (lib) {
  function foo() {
    lib.log("hello world!");
  }

  return {
    foo: foo,
  };
});

```

#### AMD 加载 CommonJS

```js
define(function () {
  // 可以直接 require
  const cjs = require("../cjs");

  return {
    cjs,
  };
});

// 也可以用 AMD 的方式，定义依赖
define(['../cjs'], function (cjs) {
  return {
    cjs,
  };
});
```

#### AMD 加载 ES6

```js
// loades6.js
// es6 is Promise
define(async function () {
  function hi() {
    console.log("hi!");
  }

  const es6 = await import("../../es6/demo1/index.js");

  return {
    hi,
    es6,
  };
});

define(["./loades6"], function (es6) {
    console.log(es6)	// Promise
    function foo() {
      lib.log("hello world!");
    }
  
    return {
      foo: foo,
      es6,
    };
  });
```

### 总结

可以看出，CommonJS、AMD 都是同步加载的，ES6 需要异步加载

## 示例代码

[https://github.com/binghong-chen/js-module-demo](https://github.com/binghong-chen/js-module-demo)
