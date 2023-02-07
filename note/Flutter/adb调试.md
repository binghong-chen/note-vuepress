# adb调试

```sh
cd /System/Volumes/Data/Users/chenbinghong/Library/Android/sdk/platform-tools
./adb --version
./adb --version
./adb --help
./adb devices
./adb tcpip 5555
./adb devices
./adb devices -l
./adb tcpip 5555
./adb kill-server
./adb devices -l
./adb tcpip 5555
./adb -s e701e86e shell
```

# [Why do I get access denied to data folder when using adb?](https://stackoverflow.com/questions/1043322/why-do-i-get-access-denied-to-data-folder-when-using-adb)



```sh
$ adb shell
$ cd /data
shell@android:/data $ run-as com.your.package 
shell@android:/data $ run-as cn.uid.ckapp
shell@android:/data/data/com.your.package $ ls
```

