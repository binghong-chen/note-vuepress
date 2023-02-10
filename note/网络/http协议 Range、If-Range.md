# http协议 Range、If-Range

[https://blog.csdn.net/csdnlijingran/article/details/102613901](https://blog.csdn.net/csdnlijingran/article/details/102613901)

## 范围请求

允许发送消息的一部分到客户端。在传送大的媒体文件、与文件下载的断点续传功能搭配使用

## 1、检测服务器是否支持范围请求

如果在响应首部中存在<font color=red>Accept-Ranges</font>（并且它的值不为 “none”），那么表示该服务器支持范围请求。

```sh
curl -I http://i.imgur.com/z4d4kWk.jpg

HTTP/1.1 200 OK
...
Accept-Ranges: bytes
Content-Length: 146515
```

在上面的响应中，Accept-Ranges: bytes 表示**界定范围的单位是bytes**，。这里**Content-Length**也是有效信息，因为它提供了**要检索的图片的完整大小**。

如果站点未发送Accept-Ranges首部，那么它有可能不支持范围请求。一些站点会明确**将其值设置为“none”**，以此来表明不支持。在这种情况下，某些应用的下载管理器会将暂停按钮禁用。

```sh
curl -I https://www.youtube.com/watch?v=EwTZ2xpQwpA

HTTP/1.1 200 OK
...
Accept-Ranges: none
```

## 2、从服务器端请求特定的范围

如果服务器支持范围请求的话，可以使用<font color=red>Range</font>首部来生成该类请求。可以指定某一范围或某几处范围。

响应首部会有<font color=red>Content-Range</font>、**Content-Length**

### 2.1 单一范围

```sh
curl http://i.imgur.com/z4d4kWk.jpg -i -H "Range: bytes=0-1023"

# 生成的请求
GET /z4d4kWk.jpg HTTP/1.1
Host: i.imgur.com
Range: bytes=0-1023

# 服务器返回
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/146515
Content-Length: 1024
...
(binary content)
```

### 2.2 多重范围

Range头部也支持一次请求文档（<font color=red>只能文档、不能视频图片？？？</font>）的多个部分。请求范围用一个逗号隔开。

```sh
curl http://www.example.com -i -H "Range: bytes=0-50, 100-150"

# 服务器返回
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=3d6b6a416f9b5
Content-Length: 282

--3d6b6a416f9b5
Content-Type: text/html
Content-Range: bytes 0-50/1270

<!doctype html>
<html>
<head>
	<title>Example Do
--3d6b6a416f9b5
Content-Type: text/html
Content-Range: bytes 100-150/1270

eta http-equiv="Content-type" content="text/html; c"
--3d6b6a416f9b5--
```

### 2.3 条件式范围请求

当（中断之后）**重新开始请求更多资源片段的时候，必须确保自从上一个片段被接收之后该资源没有进行修改。**

<font color=red>If-Range</font>请求首部可以用来生成条件式范围请求：

- 假如**条件满足**的话，条件请求就会生效，服务器会返回状态码为**206 Partial Content**的响应，**以及相应的消息主体**
- 假如**条件未能得到满足**，那么就会返回状态码**200 OK**的响应，**同时返回整个资源**。该首部可以与<font color=gold>Last-Modified</font>或者<font color=gold>ETag</font>一起使用，但二者不能同时使用

```
If-Range: Wed, 21 Oct 2015 07:28:00 GMT
```

## 3、范围请求的响应

**与范围请求相关的有三种状态**：

1. 在**请求成功**的情况下，返回**206 Partial Content**
2. 在请求的**范围越界**的情况下（范围值超过了资源的大小），返回**416 Request Range Not Satisfiable**
3. 在**不支持范围请求**的情况下，返回**200 OK**，同时返回**整个资源**

## 4、与分块传输编码的对比

<font color=red>Transfer-Encoding</font>首部**允许分块编码**，这在数据量很大，并且在请求未能完全处理完成之前<font color=gold>无法知晓响应的体积大小</font>的情况下非常有用。服务器会直接把数据发送给客户端而无需进行缓冲或确定响应的精确大小——后者会增加延时。范围请求与分块传输是兼容的，可以单独或搭配使用。