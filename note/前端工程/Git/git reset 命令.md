# git reset 命令
[https://www.runoob.com/git/git-reset.html](https://www.runoob.com/git/git-reset.html)

git reset 用于回退版本，可以指定退回某一次提交的版本

```sh
git reset [--soft | --mixed | --hard] [HEAD]
```

**--mixed** 为默认，可以不用带该参数，用于重置缓存区的文件与上一次的提交（commit）保持一致，工作区文件内容保持不变。

```
git reset [HEAD]
```

实例：

```sh
git reset HEAD^						# 回退所有内容到上一个版本
git reset HEAD^ hello.php	# 回退 hello.php 文件到上一个版本
git reset 052e						# 回退到指定版本
```

**--soft** 参数用于回退到某个版本

```sh
git reset --soft HEAD
```

实例：

```sh
git reset --soft HEAD~3		# 回退上上上一个版本
```

**--hard** 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前所有提交：

```sh
git reset --hard HEAD
```

实例：

```sh
git reset --hard HEAD~3						# 回退上上上一个版本
git reset --hard bae128						# 回退到某个版本
git reset --hard origin/master		# 将本地状态回退到远程的一样
```

注意：push到远程仓库时，可能会报错，我做了如下强制push处理，可能还有其他方法：

```sh
git push -f
```

**HEAD 说明**：

- HEAD 表示当前版本
- HEAD^ 上一个版本
- HEAD^^ 上上一个版本
- HEAD^^^ 上上上一个版本
- 以此类推...

可以使用～数字表示

- HEAD～0 表示当前版本
- HEAD～1 上一个版本
- HEAD～2 上上一个版本
- HEAD～3 上上上一个版本
- 以此类推...



注意：无法取消第一个提交，毕竟不能reset HEAD为null

比如现在只有一条提交，运行：

```sh
git reset HEAD~1
```

会报错

# git reset 3种方式
[https://blog.csdn.net/qinwenjng120/article/details/104945015](https://blog.csdn.net/qinwenjng120/article/details/104945015)

|         | git reset产生影响 |                |          | 表现                                        |                                                              |
| ------- | ----------------- | -------------- | -------- | ------------------------------------------- | ------------------------------------------------------------ |
| 选项    | HEAD              | 索引（暂存区） | 工作目录 | 原有文件内容的变更                          | 目录结构的变更（增加或删除文件）                             |
| --soft  | 是                | 否             | 否       | 修改内容还在，变成未add的状态               | 新增文件：还存在，变成未add的状态（目录结构中变成绿色，可以再次执行 git commit）；<br>删除文件：目录结构中还是没有，可以直接执行git commit |
| --mixed | 是                | 是             | 否       | 修改内容还在，变成未add的状态               | 新增文件：还存在，变成未add的状态（目录结构中变成红色，需要执行命令git add .再次执行 git commit）；<br/>删除文件：目录结构中还是没有，可以直接执行git commit |
| --hard  | 是                | 是             | 是       | 修改内容丢失，修改的代码不会变成未add的状态 | 新增文件丢失、删除的文件相当于没删                           |

![img](./assets/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FpbndlbmpuZzEyMA==,size_16,color_FFFFFF,t_70.png)