# 项目总结之 JS 模块化

CommonJS AMD UMD RequireJS Node ES5 ES6 ES2020 ES2022 esnext

## uid-cpe 项目

### CommonJS

```js
module.exports = xxx
```

它们会在node中运行，用于打包

<img src="./assets/image-20230209001157547.png" alt="image-20230209001157547" style="zoom:50%;" />

### ES6

```js
export xxx
export default xxx
```

它们会编译成在浏览器中运行的js

<img src="./assets/image-20230209000808415.png" alt="image-20230209000808415" style="zoom:50%;" />

<img src="./assets/image-20230209000657163.png" alt="image-20230209000657163" style="zoom:50%;" />

<img src="./assets/image-20230209000921994.png" alt="image-20230209000921994" style="zoom:50%;" />

<img src="./assets/image-20230209001012935.png" alt="image-20230209001012935" style="zoom:50%;" />

<img src="./assets/image-20230209001031055.png" alt="image-20230209001031055" style="zoom:50%;" />

<img src="./assets/image-20230209001104586.png" alt="image-20230209001104586" style="zoom:50%;" />

ch-web项目

```js
module.exports = xxx
```

<img src="./assets/image-20230209001416233.png" alt="image-20230209001416233" style="zoom:50%;" />

```js
export xxx
export default xxx
```

<img src="./assets/image-20230209005807246.png" alt="image-20230209005807246" style="zoom:50%;" />



## 疑问🤔️

<font color=gold>umi的配置都是用的ES6的，会在node中运行</font>

<img src="./assets/image-20230209010438241.png" alt="image-20230209010438241" style="zoom: 33%;" />