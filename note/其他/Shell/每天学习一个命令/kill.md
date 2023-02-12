# 每天学习一个命令：kill 杀掉进程

[https://einverne.github.io/post/2013/01/kill-command.html](https://einverne.github.io/post/2013/01/kill-command.html)

Linux 中的 kill 命令用来终止指定的进程（terminate a process）的运行，是 Linux 下进程管理的常用命令。通常，终止一个前台进程可以使用 Ctrl+C 键，但是，对于一个后台进程就须用 kill 命令来终止。此时就需要先使用 ps/pidof/pstree/top 等工具获取进程 PID，然后使用 kill 命令来杀掉该进程。

kill 命令是通过向进程发送指定的信号来结束相应进程的。在默认情况下，采用编号为 15 的 TERM 信号。TERM 信号将终止所有不能捕获该信号的进程。对于那些可以捕获该信号的进程就要用编号为 9 的 kill 信号，强行“杀掉”该进程。

## 命令格式：

```sh
kill [options] [PID]
```

## 命令功能：

发送指定的信号到相应进程。不指定将发送 SIGTERM（15）终止指定进程。如果仍然无法终止该程序可用 “-KILL” 参数，其发送的信号为 SIGKILL(9) ，将强制结束进程，使用 ps 命令或者 jobs 命令可以查看进程号。root 用户可以控制用户的进程，非 root 用户只能杀死自己的进程。

```
-l  信号，若果不加信号的编号参数，则使用“-l”参数会列出全部的信号名称
-a  当处理当前进程时，不限制命令名和进程号的对应关系
-p  指定 kill 命令只打印相关进程的进程号，而不发送任何信号
-s  指定发送信号
-u  指定用户
```

注意：

kill 命令可以带信号号码选项，也可以不带。如果没有信号号码，kill 命令就会发出终止信号 (15)，这个信号可以被进程捕获，使得进程在退出之前可以清理并释放资源。也可以用 kill 向进程发送特定的信号。例如：

```sh
kill -2 PID
```

它的效果等同于在前台运行 PID 的进程时按下 Ctrl+C 键。但是，普通用户只能使用不带 signal 参数的 kill 命令或最多使用 -9 信号。

kill 可以带有进程 ID 号作为参数。当用 kill 向这些进程发送信号时，必须是这些进程的所有者。如果试图撤销一个没有权限撤销的进程或撤销一个不存在的进程，就会得到一个错误信息。

可以向多个进程发信号或终止它们。

当 kill 成功地发送了信号后，shell 会在屏幕上显示出进程的终止信息。有时这个信息不会马上显示，只有当按下 Enter 键使 shell 的命令提示符再次出现时，才会显示出来。

应注意，信号使进程强行终止，这常会带来一些副作用，如数据丢失或者终端无法恢复到正常状态。发送信号时必须小心，只有在万不得已时，才用 kill 信号 9，因为进程不能首先捕获它。要撤销所有的后台作业，可以输入 kill 0。因为有些在后台运行的命令会启动多个进程，跟踪并找到所有要杀掉的进程的 PID 是件很麻烦的事。这时，使用 kill 0 来终止所有由当前 shell 启动的进程，是个有效的方法。

## 使用实例

### 列出所有信号名称

```sh
kill -l
```

输出：

```
HUP INT QUIT ILL TRAP ABRT EMT FPE KILL BUS SEGV SYS PIPE ALRM TERM URG STOP TSTP CONT CHLD TTIN TTOU IO XCPU XFSZ VTALRM PROF WINCH INFO USR1 USR2
```

说明：

只有第 9 种信号 (SIGKILL) 才可以无条件终止进程，其他信号进程都有权利忽略。

下面是常用的信号：

```
HUP    1    终端断线
INT     2    中断（同 Ctrl + C）
QUIT    3    退出（同 Ctrl + \）
TERM   15    终止
KILL    9    强制终止
CONT   18    继续（与 STOP 相反， fg/bg 命令）
STOP    19    暂停（同 Ctrl + Z）
```

### 获取指定信号的数值

```sh
kill -l KILL
9
kill -l TERM
15
```

### 用 ps 查找进程，然后用 kill 杀掉

```sh
ps -ef | grep 'program'
kill PID
```

### 无条件彻底杀死进程

```sh
kill –9 PID
```

### 杀死指定用户所有进程

```sh
kill -9 $(ps -ef | grep username)
kill -u username
```

### init 进程是杀不死的

```sh
kill -9 1
```

说明：

init 是 Linux 系统操作中不可缺少的程序之一。所谓的 init 进程，它是一个由内核启动的用户级进程。内核自行启动（已经被载入内存，开始运行，并已初始化所有的设备驱动程序和数据结构等）之后，就通过启动一个用户级程序 init 的方式，完成引导进程。所以，init 始终是第一个进程（其进程编号始终为 1）。其它所有进程都是 init 进程的子进程，init 进程是无法杀死的。

```sh
pidof
      USER	   PID	COMMAND
      root	     0	kernel_task
      root	     1	launchd
      root	   316	UserEventAgent
      root	   330	amfid
      root	   344	diskarbitrationd
      root	   343	kernelmanagerd
      root	   352	opendirectoryd
      root	   370	logind
      root	   373	usermanagerd
```

kernel_task （内核任务）进程是 mac 操作系统的核心。它就像MacBook的下丘脑，主要功能是调节mac的CPU温度。kernel_task是macOS自动启动系统进程之一，平时在后台运行，占用CPU资源也很小。

macOS 使用 `launchd` 进程来管理守护进程和代理，而你还可以用它来运行 shell 脚本。你不与 [launchd](x-man-page://launchd) 直接交互，而是使用 [launchctl](x-man-page://launchctl) 命令来载入或卸载 `launchd` 守护进程和代理。

在系统启动期间，`launchd` 是内核在设置电脑时首先运行的进程。若你想要 shell 脚本作为守护进程运行，应由 `launchd` 来启动它。其他用于启动守护进程和代理的机制可能会被 Apple 酌情移除。

## 附

### pidof

```sh
pidof | grep -i baidu
chenbingho	   678	baiduNetdiskSync
chenbingho	  6661	BaiduNetdisk_mac
chenbingho	  6666	BaiduNetdisk_mac
chenbingho	  6667	BaiduNetdisk_mac
chenbingho	  6668	BaiduNetdisk_mac
chenbingho	  6670	BaiduNetdisk_mac
chenbingho	  6675	BaiduNetdisk_mac
chenbingho	  6678	BaiduNetdisk_mac
pidof baidu
678 6661 6666 6667 6668 6670 6675 6678
```

### pstree

```sh
pstree 8837
-+= 08837 root login -fp chenbinghong
 \-+= 08838 chenbinghong -zsh
   \-+= 09234 chenbinghong pstree 8837
     \--- 09235 root ps -axwwo user,pid,ppid,pgid,command
```

