# umd
[https://zhuanlan.zhihu.com/p/96718777](https://zhuanlan.zhihu.com/p/96718777)

其是amd和commonjs的统一规范，支持两种规范，即写一套代码，可用于多种场景。其用法如下：

```js
(function (root, factory) {
            if (typeof define === 'function' && define.amd) {
                // AMD
                define(['jquery'], factory);
            } else if (typeof exports === 'object') {
                // Node, CommonJS之类的
                module.exports = factory(require('jquery'));
            } else {
                // 浏览器全局变量(root 即 window)
                root.returnExports = factory(root.jQuery);
            }
        }(this, function ($) {
            //    方法
            function myFunc(){};

            //    暴露公共方法
            return myFunc;
        }));
```

毋庸置疑的是，其写法也是最复杂的

- 前后端均通用
- 与CJS或AMD不同，UMD更像是一种配置多个模块系统的模式。
- UMD在使用诸如Rollup/ Webpack之类的bundler时通常用作备用模块



[前端模块化iife、CJS、AMD、UMD、ESM的区别](https://segmentfault.com/a/1190000040466862)

他像是一个工厂，为了同时支持CJS和AMD的规范，判断谁的规范支持就使用谁的规范，他的最外层是一个iife
