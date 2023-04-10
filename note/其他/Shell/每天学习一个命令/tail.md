# 每天学习一个命令：tail 命令

[https://www.cnblogs.com/peida/archive/2012/11/07/2758084.html](https://www.cnblogs.com/peida/archive/2012/11/07/2758084.html)

tail 命令从指定点开始将文件写到标准输出.使用tail命令的-f选项可以方便的查阅正在改变的日志文件,tail -f filename会把filename里最尾部的内容显示在屏幕上,并且不但刷新,使你看到最新的文件内容. 

## 1．命令格式

```sh
tail[必要参数][选择参数][文件]
```

## 2．命令功能

用于显示指定文件末尾内容，不指定文件时，作为输入信息进行处理。常用查看日志文件。

## 3．命令参数

```sh
-f 循环读取
-q 不显示处理信息
-v 显示详细的处理信息
-c<数目> 显示的字节数
-n<行数> 显示行数
--pid=PID 与-f合用,表示在进程ID,PID死掉之后结束. 
-q, --quiet, --silent 从不输出给出文件名的首部 
-s, --sleep-interval=S 与-f合用,表示在每次反复的间隔休眠S秒 
```

## 4．使用实例