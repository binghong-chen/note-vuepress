# NAT

## 路由器NAT是什么意思？

NAT（网络地址转换），当在专用网内部的一些主机本来已经分配到了本地IP地址（即仅在本专用网络使用的专用地址）可但是现在又想和因特网上的主机通信（并不需要加密）时，可以使用NAT方法。

通俗的说NAT技术让少数公有IP地址被使用私有地址的大量主机所共享。这一机制允许远多于IP地址空间所支持的主机共享网络。同时，由于NAT屏蔽了内部网络，也为局域网内的机器提供了安全保障。

NAT的实现方法有三种

1. 静态转换 static nat
2. 动态转换 dynamic nat
3. 端口多路复用 overload

NAT技术能解决不少令人头痛的问题。解决办法：在内部网络中使用内部地址，通过NAT把内部地址翻译成合法IP地址，在Internet上使用。具体做法：把IP包内地址域用合法IP来替换。

## 路由器NAT要不要开启？

目前大部分家用路由器自动开启NAT模式（部分默认无法更改），如果可以选择建议用户开启NAT模式，简单来说，路由器中的NAT模式就是把局域网中的内网地址转成合法的公网地址。

目前主流路由器两种模式：

1. NAT模式：局域网采用内网地址，可以在不同局域网重复，但不能在互联网上使用。进过NAT地址转换，内网地址映射为公网地址（WAN端口获取的地址）
2. 路由模式：局域网采用在互联网上可以使用的合法地址，实现不同网段段主机通过路由的方式进行互相通信，核心是一张路由表，记录三个要素：目标网络、下一跳地址、出接口。

**需要开启NAT模式。可以避免外部网络攻击**



## 维基百科

Network Address Translation

网络地址转换

又称 网络掩蔽、IP掩蔽

在IP数据包通过路由器或防火墙时重写来源IP地址或目的IP地址的技术。

普遍使用在有多台主机但只通过一个公有IP地址访问互联网的私有网络



## 辉哥解释NAT表

192.168.0.111 ------> 路由器(114.116.33.22 NAT表[2201: 192.168.0.111]) ----包[114.116.33.22:2201]--> 百度

这里NAT表使用的端口映射

## Linux ipatables设置

iptables NAT表 设置



## NAT Loopback NAT 环回

Nat回环（Lan---->Lan 端口映射）

### 应用背景

局域网内网有服务器对外发布，基于对服务器的防护，内网该用户需要通过域名或者公网ip来访问内网服务器

### 名词解释

DNAT：转换目标ip地址

SNAT：转换源ip地址

需求：将外网202.96.128.5的80端口映射至内网192.168.2.10的80端口，外网地址对应有域名，

```sh
root@localhost:~# iptables -nvL
Chain INPUT (policy ACCEPT 19 packets, 3566 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0            icmptype 8
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:80
    4   288 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            ctstate DNAT

Chain OUTPUT (policy ACCEPT 19 packets, 4258 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0            icmptype 0
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp spt:80
    2   192 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp spt:22
```

