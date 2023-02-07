# 一文讲透HTTP缓存之ETag

https://juejin.cn/post/7078272638203723789

## ETag定义及起源

ETag（Entity-Tag，下文简称：ETag）是用于HTTP缓存机制。

正式提出：HTTP/1.1协议的rfc7232，主要是为了解决Last-Modified存在的一些问题：

1. 一些文件也许会周期性的更改，但是它的内容并不改变（仅仅改变了修改时间）
2. 某些文件修改非常频繁，比如在秒以下的时间内进行修改，If-Modified-Since能检查到的粒度是s级的，无法检测到
3. 某些服务器无法精确得到文件的最后修改时间

## 强校验和弱校验

ETag格式：ETag=[ weak ] opaque-tag，其中[ weak ]是可选的。

| 值                 | 类型                  |
| ------------------ | --------------------- |
| ETag="123456789"   | 强校验                |
| ETag=W/"123456789" | 弱校验（W大小写敏感） |

强校验ETag匹配表明两个资源表示的内容是逐字节相同的，并且所有其他实体字段（例如Content-Language）也未更改。强ETag允许缓存和重组部分响应，就像字节范围请求一样。

弱校验ETag匹配仅表明这两种表示在语义上是等效的，这意味着出于实际目的它们是可互换的并且可以使用缓存副本。但是，资源表示不一定逐字节相同，因此弱ETag不适用于字节范围请求。弱ETag可能适用于Web服务器无法生成强ETag的情况，例如动态生成的内容。

匹配对比：

| ETag1 | ETag2 | 强校验 | 弱校验 |
| ----- | ----- | ------ | ------ |
| W/"1" | W/"1" | 不匹配 | 匹配   |
| W/"1" | W/"2" | 不匹配 | 不匹配 |
| W/"1" | "1"   | 不匹配 | 匹配   |
| "1"   | "1"   | 匹配   | 匹配   |

## ETag交互过程

已知，略

## ETag生成原理

没有规定生成方法。常用方法包括使用资源内容的抗冲突散列函数、最后修改时间戳的散列值或一个修订号。

我们接下来介绍的是koa框架中ETag的生成原理，其他框架/服务器生成的方式可能不太一致，但我们只需要了解其实现思路即可。

```js
// https://github.com/koajs/ETag/blob/master/index.js

// 核心代码：生成ETag的函数（下面会具体分析）

const calculate = require('ETag')

// koa中间件，对ctx进行了处理

module.exports = function ETag (options) {
  return async function ETag (ctx, next) {
    await next()
    const entity = await getResponseEntity(ctx)	// 获取body内容
    setETag(ctx, entity, options)	// 生成ETag【重点】
  }
}

async function getResponseEntity (ctx) {
  // dosomething,最终返回body：return body
}

function setETag (ctx, entity, options) {
  if (!entity) return
  ctx.response.ETag = calculate(entity, options)	// 生成ETag
}
```

```js
// https://github.com/jshttp/ETag/blob/master/index.js

// 核心代码：生成ETag的函数（承接上面）

module.exports = ETag
var crypto = require('crypto')
var Stats = require('fs').Stats
var toString = Object.prototype.toString
// 为非Stats类型创建ETag
function entitytag (entity) {
  if (entity.length === 0) {
    // fast-path empty
    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'
  }
  
  // compute hash of entity
  var hash = crypto.createHash('sha1').update(entity, 'utf8')
  	.digest('base64').substring(0, 27)
  // compute length of entity
  var len = typeof entity === 'string'
  	? Buffer.byteLength(entity, 'utf8')
  	: entity.length
  // 重点：长度(16进制)+hash(entity)值
  return '"' + len.toString(16) + '-' + hash + '"'
}
// 生成ETag
function ETag (entity, options) {
  // support fs.Stats object
  var isStats = isstats(entity)
  var weak = options && typeof options.weak === 'boolean' ? options.weak : isStats
  // generate entity tag
  var tag = isStats ? stattag(entity) : entitytag(entity)
  // 弱ETag 比 强ETag 多了个W/
  return weak ? 'W/' + tag : tag
}
// 确定对象是否是 Stats 类型
function isstats (obj) {
  // genuine fs.Stats
  if (typeof Stats === 'function' && obj instanceof Stats) {
    return true
  }
  // quack quack
  return obj && typeof obj === 'object' &&
    'ctime' in obj && toString.call(obj.ctime) === '[object Date]' &&
    'mtime' in obj && toString.call(obj.mtime) === '[object Date]' &&
    'ino' in obj && typeof obj.ino === 'number' &&
    'size' in obj && typeof obj.size === 'number'
}
// 为 Stats 类型创建ETag
function stattag (stat) {
  var mtime = stat.mtime.getTime().toString(16)
  var size = stat.size.toString(16)
  // 重点：文件大小的16进制+修改时间
  return '"' + size + '-' + mtime + '"'
}
```

## ETag生成结论

1. 对于静态文件（如css、js、图片等），ETag的生成策略是：文件大小的16进制+修改时间
2. 对于字符串或Buffer，ETag的生成策略是：字符串/Buffer长度的16进制+对应的hash值

## ETag如何生效

略

## ETag实战

略

## 总结

略