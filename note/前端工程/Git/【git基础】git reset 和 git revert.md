# 【git基础】git reset 和 git revert
[https://juejin.cn/post/6844904085770993671](https://juejin.cn/post/6844904085770993671)

1. `git revert` 后多出一条commit ，提醒同事，这里有回撤操作。
2. `git reset` 直接版之前 commit 删掉，非`git reset --hard` 的操作是不会删掉修改代码，如果远程已经有之前代码，需要强推 `git push -f`
