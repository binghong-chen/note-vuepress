# git命令回退方法

[https://blog.csdn.net/weixin_73001329/article/details/127648892](https://blog.csdn.net/weixin_73001329/article/details/127648892)

我们在使用git命令的时候，有时候误输入命令，导致需要回退到之前的状态。现在针对这种情况做一个汇总：

## 1. git add 回退

```sh
git status #先看一下add中的文件，确定已经添加的文件
git reset HEAD # 如果后面什么都不跟的话，就是add已添加的全部撤销
git reset HEAD xxx.cp # 只撤销所列的文件
```

## 2. git commit 回退

```sh
git reset --soft HEAD^
```

这样就成功撤销了你的commit。注意，仅仅是撤回commit操作，您写的代码仍然保留（工作区不变）

**--mixed** 不删除工作区，撤销commit，并且撤销 git add . 操作，这时默认参数 git reset --mixed HEAD^ 和 git reset HEAD^ 是一样的

**-soft** 不删除工作区，撤销commit，不撤销git add . 这个的改动最小

**-hard** 删除工作区，撤销commit，撤销 git add . 这个改动最大，慎用

如果只是想改commit注释，可以使用

```sh
git commit --amend
```

## 3. git review 回退

```sh
git checkout [分支名] # 切换到需要回退到分支
git log # 查看提交记录
git reset --hard # 代码退回
git reset --har [commit id] # 复制最近提交的上一条提交记录的 commit id
git review # 重新提交修改
```

## 4. git rebase 回退

```sh
git reflog # 先查看本地提交操作编号
git reset --hard 4c173eb
```

## 5. git check-pick 回退

```sh
git cherry-pick --abort
```