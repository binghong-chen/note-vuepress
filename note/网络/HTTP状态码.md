# HTTP状态码

- 100 Continue
- 101 Switch Protocols
- 200 OK
- 201 Created
- 202 Accepted
- 203 Non-Authoritative Information
- 204 No Content
- 205 Reset Content
- 206 Partial Content
- 300 Multple Choices
- 301 Moved Permanently
- 302 Found 原始描述短语：Moved Temporarily
- 303 See Other
- 304 Not Modified
- 305 Use Proxy
- 306 Unused
- 307 Temporary Redirect
- 308 Permanent Redirect
- 400 Bad Request
- 401 Unauthorized
- 402 Payment Required
- 403 Forbidden
- 404 Not Found
- 405 Method Not Allowed
- 406 Not Acceptable
- 407 Proxy Authentication Required
- 408 Request Time-out
- 409 Conflict
- 410 Gone
- 411 Length Required
- 412 Precondition Failed
- 413 Request Entity Too Large
- 414 Request-URI Too Large
- 415 Unsupported Media Type
- 416 Requested range not statisfiable
- 417 Expectation Failed
- 500 Internal Server Error
- 501 Not Implemented
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Time-out
- 505 HTTP Version not supported

https://zhuanlan.zhihu.com/p/60669395



## 301 302 303 307 308

301 308 永久重定向

302 303 307 临时重定向

304 缓存

|          | 缓存（永久重定向） | 不缓存（临时重定向） |
| -------- | ------------------ | -------------------- |
| 转GET    | 301                | 302、303             |
| 方法保持 | 308                | 307                  |

301、302 都是 HTTP/1.0的规范

303、307、308是HTTP/1.1的规范

302（规范的实现有二义性）分为 303 和 307（307继承了302在HTTP 1.0中的规范、303继承了302在HTTP1.0中的实现）

302规范已经不再推荐使用了，作为兼容保留



## 401 403 404

401 是没有凭证，403是服务器知道凭证，但是权限不够

1. 验证令牌（未通过401）
2. 验证用户权限（未通过403）
3. 检查资源是否存在（未通过404）