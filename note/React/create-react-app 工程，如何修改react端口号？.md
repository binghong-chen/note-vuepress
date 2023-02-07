# create-react-app 工程，如何修改react端口号？

https://blog.51cto.com/u_15328720/3384510

`3000`端口是`webpack`配置里写的，可以通过传递一个`PORT`全局变量，来修改这个端口。当然，您还可以再`node_modules/react-scripts/`目录下面，批量搜索`3000`字样，这个操作比较暴力。

**最优方案**：先安装`cross-env`插件，然后通过修改`package.json`中的命令行，传递进来新的`PORT`环境变量。本方案最完美，其余方案都是补充的逗逼方案。

全局安装`cross-env`：

```sh
npm install cross-env -g
```

修改`package.json`：

```json
{
  // ...
  "scripts": {
    "start": "cross-env PORT=9017 react-scripts start",
    // ...
  } 
  // ...
}
```

