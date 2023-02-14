# 每天学习一个命令：cd

https://www.cnblogs.com/peida/archive/2012/10/24/2736501.html

Linux cd 命令可以说是Linux中最基本的命令语句，其他的命令语句要进行操作，都是建立在使用 cd 命令上的。所以，学习Linux 常用命令，首先就要学好 cd 命令的使用方法技巧。

## 基础

```sh
cd xxSubPath
cd /absolute/path/to/xxx
cd ..
cd /
cd ~
cd -	# 返回进入此目录之前所在的目录
```

“当前用户主目录”和“系统根目录”是两个不同的概念。进入当前用户主目录有两个方法。

## 返回进入此目录之前所在的目录

```sh
[root@localhost soft] pwd
/opt/soft
[root@localhost soft] cd - 
/root
[root@localhost ~] pwd
/root
[root@localhost ~] cd -
/opt/soft
[root@localhost soft]
```

## 把上个命令的参数作为cd参数使用

```sh
[root@localhost soft] cd !$
cd -
/root
[root@localhost ~] cd !$
cd -
/opt/soft
[root@localhost soft]
 
[root@localhost soft] mkdir ~/Study/Shell
[root@localhost ~] cd !$
[root@localhost ~] cd ~/Study/Shell
[root@localhost ~/Study/Shell]

[root@localhost soft] ls ~/Study/Shell
[root@localhost ~] cd !$
[root@localhost ~] cd ~/Study/Shell
[root@localhost ~/Study/Shell]
```

