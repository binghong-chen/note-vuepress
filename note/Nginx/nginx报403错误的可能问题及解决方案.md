# nginx报403错误的可能问题及解决方案

[https://www.linuxprobe.com/nginx-403-forbidden.html](https://www.linuxprobe.com/nginx-403-forbidden.html)

## 一、由于启动用户和nginx工作用户不一致所致

```sh
ps aux | grep "nginx: worker process"
root     20289  0.0  0.1  40072  3540 ?        S    17:51   0:00 nginx: worker process is shutting down
nginx    20983  0.0  0.1  39936  2076 ?        S    17:57   0:00 nginx: worker process
nginx    20985  0.0  0.1  39936  2076 ?        S    17:57   0:00 nginx: worker process
root     20992  0.0  0.0 112808   972 pts/3    S+   17:57   0:00 grep --color=auto nginx: worker process
```

修改成root用户启动

```nginx
# user  nginx;
user  root;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

```

## 二、配置文件中缺少index index.html index.htm

```nginx
server {
    listen       80;
    server_name  localhost;
    index  index.php index.html;
    root  /data/www/;
}
```

## 三、权限问题，如果nginx没有web目录的操作权限，也会出现403错误

```sh
chmod -R 777 /data
```