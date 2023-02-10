# 如何测试udp连接？

```sh
telnet ip port
```

发现通不了，后来查看服务器规则发现该端口是udp，又查找资料发现，telnet不能连tcp

[telnet counterpart for UDP](https://serverfault.com/questions/395342/telnet-counterpart-for-udp)

[Can we Telnet UDP port?](https://www.quora.com/Can-we-Telnet-UDP-port)

Unfortunately telnet will only allow to test ports for TCP.

On the contrary **nc** can test ports for both TCP and UDP.

**TCP**

```sh
# nc -z -v -u [hostname/IP address] [port number] 
 
# nc -z -v 192.168.10.12 22 
Connection to 192.118.20.95 22 port [tcp/ssh] succeeded! 
```

**UDP**

```sh
# nc -z -v [hostname/IP address] [port number] 
 
# nc -z -v -u 192.168.10.12 123 
Connection to 192.118.20.95 123 port [udp/ntp] succeeded! 
```
