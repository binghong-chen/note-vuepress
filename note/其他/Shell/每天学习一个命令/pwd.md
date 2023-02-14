# 每天学习一个命令：pwd

https://www.cnblogs.com/peida/archive/2012/10/24/2737730.html

Linux中用 pwd 命令来查看”当前工作目录“的完整路径。 简单得说，每当你在终端进行操作时，你都会有一个当前工作目录。 
在不太确定当前位置时，就会使用pwd来判定当前目录在文件系统内的确切位置。

一般情况下不带任何参数
如果目录是链接时：
格式：pwd -P 显示出实际路径，而非使用连接（link）路径。 

## 显示目录链接

目录连接链接时，pwd -P 显示出实际路径，而非使用连接（link）路径；pwd显示的是连接路径

```sh
[root@localhost soft] cd /etc/init.d 
[root@localhost init.d] pwd
/etc/init.d
[root@localhost init.d] pwd -P
/etc/rc.d/init.d
[root@localhost init.d]
```

## 当前目录被删除了，而pwd命令仍然显示那个目录

 **输出：**

```sh
[root@localhost init.d] cd /opt/soft
[root@localhost soft] mkdir removed
[root@localhost soft] cd removed/
[root@localhost removed] pwd
/opt/soft/removed
[root@localhost removed] rm ../removed -rf
[root@localhost removed] pwd
/opt/soft/removed
[root@localhost removed] /bin/pwd
/bin/pwd: couldn't find directory entry in “..” with matching i-node
[root@localhost removed] cd 
[root@localhost ~] pwd
/root
[root@localhost ~]
```

