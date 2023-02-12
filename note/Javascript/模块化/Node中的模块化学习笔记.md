# Node中的模块化学习笔记

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

## CommonJS ES6 AMD

### CommonJS

#### 导入导出写法

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

#### 加载 ES6

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

#### 加载 AMD

```sh
npm install AMD-loader
```

```js
// 加载 AMD
var AMD = require("./AMD");	// 可以省略 后缀 和 文件夹导入（省略比如 index.js 的入口文件）
console.log(AMD)
```

### ES6

#### 导入导出写法

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

#### 加载 CommonJS



#### 加载 AMD



### AMD

#### 导入导出写法

#### 加载 CommonJS

#### 加载 ES6
