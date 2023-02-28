# tmux

[http://www.ruanyifeng.com/blog/2019/10/tmux.html](http://www.ruanyifeng.com/blog/2019/10/tmux.html)

Tmux 是一个终端复用器（terminal multiplexer），非常有用，属于常用的开发工具。

本文介绍如何使用 Tmux。

## 一、Tmux 是什么？

### 1.1 会话与进程

<font color=red>why</font>

命令行的典型使用方式是，打开一个终端窗口（terminal window，以下简称"窗口"），在里面输入命令。**用户与计算机的这种临时的交互，称为一次"会话"（session）** 。

会话的一个重要特点是，窗口与其中启动的进程是[连在一起](https://www.ruanyifeng.com/blog/2016/02/linux-daemon.html)的。打开窗口，会话开始；关闭窗口，会话结束，会话内部的进程也会随之终止，不管有没有运行完。

一个典型的例子就是，[SSH 登录](https://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)远程计算机，打开一个远程窗口执行命令。这时，网络突然断线，再次登录的时候，是找不回上一次执行的命令的。因为上一次 SSH 会话已经终止了，里面的进程也随之消失了。

为了解决这个问题，<font color=red>会话与窗口可以"解绑"</font>：窗口关闭时，会话并不终止，而是继续运行，等到以后需要的时候，再让<font color=red>会话"绑定"其他窗口</font>。

### 1.2 Tmux 的作用

**Tmux 就是会话与窗口的"解绑"工具，将它们彻底分离。**

> 1. 它允许在单个窗口中，同时访问多个会话。这对于同时运行多个命令行程序很有用。
> 2. 它可以让新窗口"接入"已经存在的会话。
> 3. 它允许每个会话有多个连接窗口，因此可以多人实时共享会话。
> 4. 它还支持窗口任意的垂直和水平拆分。

类似的终端复用器还有 GNU Screen。Tmux 与它功能相似，但是更易用，也更强大。

## 二、基本用法

### 2.1 安装

Tmux 一般需要自己安装。

> ```bash
> # Ubuntu 或 Debian
> $ sudo apt-get install tmux
> 
> # CentOS 或 Fedora
> $ sudo yum install tmux
> 
> # Mac
> $ brew install tmux
> ```

### 2.2 启动与退出

安装完成后，键入`tmux`命令，就进入了 Tmux 窗口。

> ```bash
> $ tmux
> ```

上面命令会启动 Tmux 窗口，底部有一个状态栏。状态栏的左侧是窗口信息（编号和名称），右侧是系统信息。

![img](https://www.wangbase.com/blogimg/asset/201910/bg2019102006.png)

按下`Ctrl+d`或者显式输入`exit`命令，就可以退出 Tmux 窗口。

> ```bash
> $ exit
> ```

### 2.3 前缀键

Tmux 窗口有大量的快捷键。所有快捷键都要通过前缀键唤起。默认的前缀键是`Ctrl+b`，即先按下`Ctrl+b`，快捷键才会生效。

举例来说，帮助命令的快捷键是`Ctrl+b ?`。它的用法是，在 Tmux 窗口中，先按下`Ctrl+b`，再按下`?`，就会显示帮助信息。

然后，按下 ESC 键或`q`键，就可以退出帮助。
