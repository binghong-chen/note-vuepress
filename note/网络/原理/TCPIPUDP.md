# TCP/IP/UDP

[https://juejin.cn/post/7016593221815910408](https://juejin.cn/post/7016593221815910408)

## TCP 三次握手

1. client  syn=j					SYN_SENT
2. server ack=j+1,syn=k     SYN_RECV
3. client  ack=k+1               ESTABLISHED

## TCP 四次挥手

1. client FIN=1,seq=u                         FIN-WAIT-1
2. server ACK=1,ack=u+1,seq=v       CLOSE-WAIT                                                         client                                			   FIN-WAIT-2
3. server FIN=1,ack=u+1,seq=w        LAST-ACK
4. Client ACK=1,ack=w+1,seq=u+1  TIME-WAIT      2**MSL(最长报文寿命)  CLOSED   server                                             CLOSED

## TCP/IP 如何确保数据包传输的有序可靠

对字节流分段并编号，然后通过<font color=red>ACK回复</font>和<font color=red>超时重发</font>两个机制来保证

1. 为了保证数据包的可靠传递，发送方必须把已发送的数据包保留在缓冲区
2. 发送方还为每个已发送的数据包启动一个超时定时器
3. 如在定时器超时之前收到了对方发来的应答信息（可能是对本包的应答，也可能是对本包后续包的应答），则释放该数据包占用的缓冲区
4. 否则，重传该数据包，直到收到答应或重传次数超过规定的最大次数为止
5. 接收方收到数据包后，先进行CRC校验，如果正确则把数据交给上层协议，然后给发送方发送一个累计应答包，表明该数据已收到，如果接收方正好也还有数据要发送给发送发，应答包也可放在数据包中捎带过去

## TCP 与 UDP 的区别

1. TCP是面向<font color=red>连接</font>的；而UDP是无连接的
2. TCP仅支持<font color=red>单播传输</font>；UDP提供了单播、多播、广播
3. TCP三次握手保证了连接的<font color=red>可靠性</font>；UDP是无连接的、不可靠的一种数据传输协议，不需要建立连接，对接收方的数据也不发送确认信号，发送方也不知道数据是否会正确接收
4. UDP的<font color=red>头部开销</font>比TCP更小，数据<font color=red>传输速率更高</font>，<font color=red>实时性更好</font>