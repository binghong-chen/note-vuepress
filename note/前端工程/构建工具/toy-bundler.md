https://github.com/sorrycc/toy-bundler

## 目录结构

<img src="/Users/chenbinghong/Workspace/CBH/note-vuepress/note/前端工程/构建工具/assets/image-20230409222334440.png" alt="image-20230409222334440" style="zoom:50%;" />

## package.json 配置

<img src="/Users/chenbinghong/Workspace/CBH/note-vuepress/note/前端工程/构建工具/assets/image-20230409222124112.png" alt="image-20230409222124112" style="zoom:50%;" />

### @types/resolve resolve 用于处理路径（相对路径）

src/resolve.ts

```ts
import type { IConfig } from './types';
import path from 'path';
import { sync as resolveSync } from 'resolve';

export function resolve(opts: {
  filePath: string;
  dependency: string;
  config: IConfig;
}) {
  const dep = opts.dependency;
  // handle externals first
  // 外部模块，不用分析 直接返回 React、ReactDOM
  if (opts.config.externals?.[dep]) {
    return dep;
  }
  // TODO: support alias
  // 内部模块，查找引用 （相对路径dep，相对于 filePath）
  return resolveSync(dep, {
    basedir: path.dirname(opts.filePath),
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  });
}

```



### @types/yargs-parser yarns-parser

代码中没看到用到

一个把命令行参数 转化为js对象的工具

```js
const argv = require('yargs-parser')(process.argv.slice(2))
console.log(argv)
```

```sh
$ node example.js --foo=33 --bar hello
{ _: [], foo: 33, bar: 'hello' }
```

### cjs-module-lexer cjs-module-lexer-rs

解析依赖的引用

```ts
import { Loader, transform as esTransform } from 'esbuild';
import path from 'path';
import { init, parse } from 'cjs-module-lexer-rs';

// TODO: sourcemap
// TODO: await import() & code splitting
export async function transform(opts: {
  content: string;
  filePath: string;
}): Promise<{
  content: string;
  dependencies: string[];
}> {
  await init();
  const transformResult = await esTransform(opts.content, {
    tsconfigRaw: {},
    loader: getLoader(opts.filePath),
    sourcefile: opts.filePath,
    platform: 'browser',
    format: 'cjs',
  });
  const parseResult = parse(transformResult.code, opts.filePath);
  console.log({ parseResult });
  return {
    content: `${transformResult.code}`,
    dependencies: parseResult.imports,
  };
}

function getLoader(filePath: string) {
  const extname = path.extname(filePath);
  if (['.js', '.ts', '.jsx', '.tsx', '.css'].includes(extname)) {
    return extname.slice(1) as Loader;
  }
  return 'file';
}
```

```sh
 pnpm test 

> toy-bundler@0.0.0 test /Users/chenbinghong/GitHubClone/toy-bundler
> ./bin/toy-bundler.js

{
  parseResult: {
    imports: [ './foo', 'react', 'react-dom/client' ],
    exports: [],
    reexports: [],
    errors: []
  }
}
{
  parseResult: { imports: [], exports: [], reexports: [], errors: [] }
}
✅
```



### esbuild

```ts
import { Loader, transform as esTransform } from 'esbuild';

function getLoader(filePath: string) {
  const extname = path.extname(filePath);
  if (['.js', '.ts', '.jsx', '.tsx', '.css'].includes(extname)) {
    return extname.slice(1) as Loader;
  }
  return 'file';
}

const transformResult = await esTransform(opts.content, {
    tsconfigRaw: {},
    loader: getLoader(opts.filePath),
    sourcefile: opts.filePath,
    platform: 'browser',
    format: 'cjs',
  });
```

```ts
export type Platform = 'browser' | 'node' | 'neutral'
export type Format = 'iife' | 'cjs' | 'esm'
export type Loader = 'base64' | 'binary' | 'copy' | 'css' | 'dataurl' | 'default' | 'empty' | 'file' | 'js' | 'json' | 'jsx' | 'text' | 'ts' | 'tsx'
```

不用插件也可以解析 ts、jsx、tsx等

### father 

[新一代 NPM 包研发工具 father 4 发布](https://zhuanlan.zhihu.com/p/558192063)

### prettier-plugin-organize-imports

### prettier-plugin-packagejson

## father打包

```sh
pnpm build
```

会将 src 中的ts 编译到 dist

<img src="/Users/chenbinghong/Workspace/CBH/note-vuepress/note/前端工程/构建工具/assets/image-20230409222716518.png" alt="image-20230409222716518" style="zoom:50%;" />

src/dependency.ts

```ts
import { IConfig, IDependencyMap } from './types';
import { resolve } from './resolve';

export function analyzeDependencies(opts: {
  filePath: string;
  dependencies: string[];
  config: IConfig;
}) {
  const map: IDependencyMap = new Map();
  for (const dep of opts.dependencies) {
    const resolvedPath = resolve({
      filePath: opts.filePath,
      dependency: dep,
      config: opts.config,
    });
    map.set(dep, resolvedPath);
  }
  return map;
}
```

dist/dependency.d.ts

```ts
import { IConfig, IDependencyMap } from './types';
export declare function analyzeDependencies(opts: {
    filePath: string;
    dependencies: string[];
    config: IConfig;
}): IDependencyMap;
//# sourceMappingURL=dependency.d.ts.map
```

dist/dependency.d.ts.map

```json
{"version":3,"file":"dependency.d.ts","sourceRoot":"","sources":["dependency.ts"],"names":[],"mappings":"AAAA,OAAO,EAAE,OAAO,EAAE,cAAc,EAAE,MAAM,SAAS,CAAC;AAGlD,wBAAgB,mBAAmB,CAAC,IAAI,EAAE;IACxC,QAAQ,EAAE,MAAM,CAAC;IACjB,YAAY,EAAE,MAAM,EAAE,CAAC;IACvB,MAAM,EAAE,OAAO,CAAC;CACjB,kBAWA"}
```

dist/dependency.js

```js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/dependency.ts
var dependency_exports = {};
__export(dependency_exports, {
  analyzeDependencies: () => analyzeDependencies
});
module.exports = __toCommonJS(dependency_exports);
var import_resolve = require("./resolve");
function analyzeDependencies(opts) {
  const map = /* @__PURE__ */ new Map();
  for (const dep of opts.dependencies) {
    const resolvedPath = (0, import_resolve.resolve)({
      filePath: opts.filePath,
      dependency: dep,
      config: opts.config
    });
    map.set(dep, resolvedPath);
  }
  return map;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  analyzeDependencies
});
```

father 会编译 ts 成 d.ts d.ts.map js（生成的是CommonJS规范的js）