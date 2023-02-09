# Node中的模块化学习笔记

`module`	`exports`	`module.exports`

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

