# Websocket

[https://zhuanlan.zhihu.com/p/145628937](https://zhuanlan.zhihu.com/p/145628937)

[https://zhuanlan.zhihu.com/p/78126597](https://zhuanlan.zhihu.com/p/78126597)

[https://www.zhihu.com/question/67784701](https://www.zhihu.com/question/67784701)

Websocket 是基于TCP/IP协议，独立于HTTP协议的通信协议

websocket是双向通信，有状态，客户端一（多）个与服务端一（多）双向实时响应（客户端↔️服务端）

RFC6455

### 请求消息体

```
GET /xxx HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jzQ==
# websocket协议的子协议，自定义字符，可理解为频道
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

### 响应消息体

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
```

返回的Sec-WebSocket-Accept是用Sec-WebSocket-Key算出来的

其中使用了一个魔数（Mgic Number）：258EAFA5-E914-47DA-95CA-C5AB0DC85B11

```
Sec-WebSocket-Accept = base64(SHA1(Sec-WebSocket-Key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'))
```

这一步只是为了确定服务器是否真的支持websocket（而不是通过Upgrade消息头部来判断）

### 状态码

连接成功状态码：

101:HTTP协议切换为Websocket协议

连接关闭状态码：

1000:正常断开连接

1001:服务器断开连接

1002:websocket协议错误

1003:客户端接受了不支持数据格式（只允许接受文本消息，不允许接受二进制数据，是客户端限制不接受二进制数据，而不是websocket协议不支持二进制数据）。

1006:异常关闭

1007:客户端接受了无效数据格式（文本消息编码不是utf-8）

1009:传输数据量过大

1010:客户端终止连接

1011:服务器终止连接

1012:服务端正在重新启动

1013:服务端临时终止

1014:通过网关或代理请求服务器，服务器无法及时响应

1015:TLS握手失败



### 数据帧

每一个数据帧都包含帧头+有效数据
