# tar解压直接重命名

[http://www.manongjc.com/detail/19-zlmmmaowmqydddd.html](http://www.manongjc.com/detail/19-zlmmmaowmqydddd.html)

[https://blog.csdn.net/u012795439/article/details/126725642](https://blog.csdn.net/u012795439/article/details/126725642)

```sh
mkdir ./mqtt-project && tar -xzvf project.tar.gz -C ./mqtt-project --strip-components 1
```

> 注： --strip-components 1 解压至下一级目录，若为2则解压至下下级目录
