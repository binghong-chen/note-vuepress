# npm install 参数

`npm install --save xxx` 会添加到 dependencies

`npm install --save-dev xxx` 会添加到 devDependencies

–save：模块名将被添加到 dependencies，可以简化为参数-S。
–save-dev：模块名将被添加到 devDependencies，可以简化为参数-D。

**npm install 模块**：安装好后不写入package.json中

**npm install 模块 --save** 安装好后写入package.json的dependencies中（生产环境依赖） 如 vue ,react 等

**npm install 模块 --save-dev** 安装好后写入package.json的devDepencies中（开发环境依赖）如babel，sass-loader这些解析器、gulp ，babel，webpack 辅助工具

- `dependencies`：它包含的依赖包是需要发布到生产环境中的，是项目正常运行必须依赖的包。
- `devDependencies`：它包含的依赖包只在开发时使用，不用于生产环境，如果只需要项目正常运行，则不必安装这里面的包。

[https://blog.csdn.net/lw001x/article/details/124167419](https://blog.csdn.net/lw001x/article/details/124167419)

常用参数

- -P, --save-prod           dependencies 依赖项安装，不指定-D或-O时，默认使用此项 <font color=gold>就是-S？</font>
- -D, --save-dev            devDependencies 开发依赖项安装
- -O, --save-optional     optionalDependencies 可选依赖项安装
- -g, --global                 全局安装
- -B, --save-bundle       bundleDependencies 依赖项安装
- -E, --save-exact         明确版本号安装，不使用^符号进行默认安装。
- -w, --workspace          install 命令也是支持多工作区安装的
- -ws, --workspaces      设置为false时，禁用workspaces

[https://main--typescript-eslint.netlify.app/getting-started](https://main--typescript-eslint.netlify.app/getting-started)

```sh
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```

[https://m.imooc.com/wiki/typescriptlesson-tslinteslint](https://m.imooc.com/wiki/typescriptlesson-tslinteslint)

```sh
npm install -d eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

-d 和 -D 是一样的，都是 --save-dev 的简写，不区分大小写

-s 和 -S 是一样的，都是 --save 的简写，不区分大小写

