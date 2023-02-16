# hisotry显示时间
[https://blog.csdn.net/WoBenZiYou/article/details/101465171](https://blog.csdn.net/WoBenZiYou/article/details/101465171)

## MacOS zsh history命令显示操作时间


zsh 不必像bash一样需要配置~/.bashrc

```sh
export HISTTIMEFORMAT='%F %T '
```

直接执行命令：

```sh
$ history -E
    1   2.12.2013 14:19  cd ..
$ history -i
    1  2013-12-02 14:19  history -E
$ history -D
    1  0:00  history -E
    2  0:00  history -I
```

