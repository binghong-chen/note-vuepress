# 使用 ESLint 来规范 TypeScript 代码

https://m.imooc.com/wiki/typescriptlesson-tslinteslint

https://typescript-eslint.io/

https://github.com/typescript-eslint/typescript-eslint

https://main--typescript-eslint.netlify.app/getting-started

## 安装环境

```sh
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```

## 配置 .eslintrc.cjs 文件

```js
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};
```

## 项目下的一个ts文件

```ts
interface User {
    name: string, id: number, age: number
}

interface Animal {
    eat(): void
}

let animal: Animal = { eat() { } }

type A = 'a' | "b" | `c`
```

## 启用eslint检测

```sh
 npx eslint .

XXX/typescript/typescript-eslint-demo/eslint/1.ts
   1:11  warning  'User' is defined but never used                   @typescript-eslint/no-unused-vars
   9:5   warning  'animal' is assigned a value but never used        @typescript-eslint/no-unused-vars
   9:5   error    'animal' is never reassigned. Use 'const' instead  prefer-const
   9:30  error    Unexpected empty method 'eat'                      @typescript-eslint/no-empty-function
  11:6   warning  'A' is defined but never used                      @typescript-eslint/no-unused-vars

✖ 5 problems (2 errors, 3 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

