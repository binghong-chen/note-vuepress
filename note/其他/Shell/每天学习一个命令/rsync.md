# rsync
[https://www.ruanyifeng.com/blog/2020/08/rsync.html](https://www.ruanyifeng.com/blog/2020/08/rsync.html)

```sh
rsync -av  root@39.107.49.148:/root/abc.txt ./abc.txt # ip 不行 Connection reset by 39.107.49.148 port 22
rsync -av  root@chenbinghong.top:/root/abc.txt ./abc.txt # 可以
```