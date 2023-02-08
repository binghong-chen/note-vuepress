# Git 合并多个 commit，保持历史简洁

https://cloud.tencent.com/developer/article/1690638

## git rebase

```sh
# 从HEAD版本开始往过去树3个版本
git rebase -i HEAD~3

# 合并指定版本号（不包含此版本）
git rebase -i [commitid]
```

说明：

- `-i (--interactive)`：弹出交互式的界面进行编辑合并
- `[commitid]`：要合并的多个版本之前的版本号，注意：`[commitid]`本身不参与合并

指令解释（交互编辑时使用）：

- p, pick = use commit
- r, reword = use commit, but edit the commit message
- e, edit = use commit, but stop for amending
- s, squash = use commit, but meld into previous commit
- f, fixup = like "squash",  but discard this commit's log message
- x, exec = run command (the rest of the line) using shell
- d, drop = remove commit