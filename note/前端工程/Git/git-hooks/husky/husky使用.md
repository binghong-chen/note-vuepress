# husky使用
```sh
npm install husky --save-dev
```

package.json

```json
{
	"scripts": {
		...
		"prepare": "husky install"
	}
}
```

运行

```sh
npm run prepare 
```

会生成.husky文件夹

hint: The '.husky/pre-commit' hook was ignored because it's not set as executable.
hint: You can disable this warning with `git config advice.ignoredHook false`.

```sh
chmod +x .husky/pre-commit
```

TODO:  我记得看到文章，可以在 `preinstall` 中做修改权限的事情

可以参考npm 的 scripts：https://docs.npmjs.com/cli/v9/using-npm/scripts 做些操作