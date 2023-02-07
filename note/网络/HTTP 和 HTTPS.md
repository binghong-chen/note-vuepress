# HTTP 和 HTTPS

https://juejin.cn/post/7016593221815910408

## 1. http和https的基本概念

http：是一个客户端和服务器端请求和答应的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的超文本传输协议。

https：是以安全为目的的HTTP通道，即HTTP下加入SSL层进行加密。其作用是：建立一个信息安全通道，来确保数据的传输，确保网站的真实性。

## 2. http和https的区别和优缺点

- http是超文本传输协议，信息是明文的，https协议要比http协议<font color=red>安全</font>，https是具有安全性的ssl加密传输协议，可防止数据在传输过程中被窃取、改变，确保数据的完整性
- http协议<font color=red>默认端口</font>是80，https是443
- http的连接很简单，是无状态的。https握手阶段比较<font color=red>费时</font>，会使页面加载时间延长50%，增加10%～20%的耗电
- https<font color=red>缓存</font>不如http高效，会增加数据开销
- https协议需要ca证书，费用较高，功能越强大<font color=red>费用</font>越高
- SSL证书需要绑定<font color=red>IP</font>，benign在同一个IP上绑定多个域名，IPV4资源支持不了这种消耗

## 3. https协议的工作原理

客户端在使用 HTTPS 方式与 Web 服务器通信时有以下几个步骤：

1. 客户端使用 https url 访问服务器，则要求 web 服务器 <font color=red>建立 ssl 连接</font>
2. Web 服务求接收到客户端请求后，会<font color=red>将网站的证书（证书中包含公钥，非对称加密公钥），传输给客户端</font>
3. 客户端和 web 服务器开始<font color=red>协商 ssl 连接的安全等级</font>，也就是加密等级
4. 客户端浏览器通过双方协商一致的安全等级，<font color=red>建立会话密钥（对称加密密钥）</font>，然后通过网站的公钥来加密会话密钥，并传送给网站
5. web 服务器<font color=red>通过自己的私钥解密出会话密钥</font>
6. web 服务器<font color=red>通过会话密钥加密与客户端之间的通信</font>

**注意，是客户端生成的对称加密密钥，用服务器端提供的非对称加密公钥加密，发送给服务器端，服务器端用非对称加密私钥解密，得到对称加密的密钥**