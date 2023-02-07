# npm install 参数

`npm install --save xxx` 会添加到 dependencies

`npm install --save-dev xxx` 会添加到 devDependencies

–save：模块名将被添加到 dependencies，可以简化为参数-S。
–save-dev：模块名将被添加到 devDependencies，可以简化为参数-D。

**npm install 模块**：安装好后不写入package.json中

**npm install 模块 --save** 安装好后写入package.json的dependencies中（生产环境依赖）

**npm install 模块 --save-dev** 安装好后写入package.json的devDepencies中（开发环境依赖）