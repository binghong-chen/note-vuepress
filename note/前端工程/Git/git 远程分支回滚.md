# git 远程分支回滚

https://www.jianshu.com/p/efaad905258c

git代码库回滚: 指的是将代码库某分支退回到以前的某个commit id

【本地代码库回滚】：

```sh
git reset --hard commit-id				# 回滚到commit-id，将commit-id之后提交的commit都去除
git reset --hard HEAD~3						# 将最近3次的提交回滚
```

【远程代码库回滚】：

这个是重点要说的内容，过程比本地回滚要复杂

应用场景：自动部署系统发布后发现问题，需要回滚到某一个commit，再重新发布

原理：先将本地分支退回到某个commit，删除远程分支，再重新push本地分支

操作步骤：

```sh
git checkout the_branch
git pull
git branch the_branch_backup						# 备份一下这个分支的当前状况
git reset --hard the_commit_id					# 把the_branch本地回滚到the_commit_id
git push origin :the_branch							# 删除远程 the_branch
git push origin the_branch							# 用回滚后的本地分支重新建立远程分支
git push origin :the_branch_backup			# 如果前面都成功了，删除这个备份分支
```

## 方法一

1. 新建backup分支作为备份，以防万一

   ```sh
   git branch backup
   ```

2. 将本地分支的backup分支推送到远程backup

   ```sh
   git push origin backup:backup
   ```

3. 本地仓库彻底回退到xxx版本，xxx版本之后的commit信息将丢失

   ```sh
   git reset --hard xxx
   ```

4. 删除远程master分支（注意master前有个:）

   ```sh
   git push origin :master
   ```

   主要远程仓库的master如果是保护分支将报错，请去掉对分支的保护设置：
    remote: GitLab: You are  allowed  to  deleted protected branches from this project. To http://gitlab.mogujie.org/shihao/afanty.git ! [remote rejected] master (pre-receive hook declined) error: failed to push some refs to 'http://gitlab.mogujie.org/xxxx/xxxx.git'

5. 重新创建远程master分支（这跟第一次提交本地代码库给远程仓库一样）

   ```sh
   git push origin master
   ```

## 方法二

1. 本地代码回滚到上一版本（或指定版本）

   ```sh
   git reset --hard HEAD~1
   ```

2. 加入-f参数，强制提交，远端将强制更新到reset版本

   ```sh
   git push -f
   ```

