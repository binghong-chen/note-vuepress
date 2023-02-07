# CSP

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP

内容安全策略（CSP）是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本（XSS）和数据注入攻击等。

CSP是被设计成向后兼容的。不支持CSP的浏览器也能与实现了CSP的服务器正常合作，反之亦然：不支持CSP的浏览器只会忽略它，如常运行，默认为网页内容使用标准的同源策略。如果网站不提供CSP头部，浏览器也使用标准的同源策略。

为使CSP可用，需要配置网络服务器返回`Content-Security-Policy`HTTP头部（有时你会看到一些关于`X-Content-Security-Policy`头部的提法，那是旧版。

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
```

## 威胁

### 跨站脚本攻击

CSP的主要目标是减少和报告XSS攻击，XSS攻击利用了浏览器对于从服务器获取的内容的信任。恶意脚本在受害者的浏览器中运行，因为浏览器信任其内容来源，即使有的时候这些脚本并非来自于它本该来自的地方。

CSP通过指定有效域——即从浏览器认可的可执行脚本的有效来源——使服务器管理者有能力减少或消除XSS攻击所依赖的载体。一个CSP兼容的浏览器将会仅执行从白名单域获取到的脚本文件，忽略所有的其他脚本（包括內联脚本（inline-script）和HTML的事件处理属性）。

作为一种终极防护形式，始终不允许执行脚本的站点可以选择全面禁止脚本执行。

### 数据包嗅探攻击

除限制可以加载内容的域，服务器还可以指明哪种协议允许使用；比如（从理想化的安全角度来说），服务器可以指定所有内容必须通过HTTPS加载。一个完整的数据安全传输策略不仅强制使用HTTPS进行数据传输，也为所有的cookie标记安全标识[cookies with the secure flag](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)，并且提供自动重定向使得HTTP头部确保连接它的浏览器使用加密通道。

## 使用CSP

配置内容安全策略涉及到添加[`Content-Security-Policy`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)HTTP头部到一个页面，并配置相应的值，以控制用户代理（浏览器等）可以为该页面获取哪些资源。比如一个可以上传文件和显示图片的页面，应该允许图片来自任何地方，但限制表单的action属性只可以赋值为指定的端点。一个经过恰当设计的内容安全策略应该可以有效的保护页面免受跨站脚本攻击。本文阐述如何恰当的构造这样的头部，并提供了一些例子。

### 指定策略

你可以使用[`Content-Security-Policy`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)HTTP头部来指定你的策略，像这样：

```
Content-Security-Policy: policy
```

policy参数是一个包含了各种描述你的CSP策略指定的字符串。

### 描述策略

一个策略由一系列策略指令组成，每个策略指令都描述了一个针对某个特定类型资源以及生效范围的策略。你的策略应当包含一个[`default-src`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/default-src)策略指令，在其他资源类型没有符合自已的策略时应用该策略（有关完整列表查看[`default-src`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/default-src)）。一个策略可以包含[`default-src`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/default-src)或者 [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)指令来防止内联脚本运行，并杜绝`eval()`的使用。一个策略也可包含一个 [`default-src`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/default-src)或者 [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)指令来限制来自一个`style`元素或者style属性的内联样式。

## 示例：常见用例

这一部分提供了一些常用的安全策略方案示例。

### 示例1

一个网站管理者想要所有内容均来自站点的同一个源（不包括其子域名）

```
Content-Security-Policy: default-src 'self'
```

### 示例2

一个网站管理者允许内容来自信任的域名或者其子域名（域名不必与CSP设置所在的域名相同）

```
Content-Security-Policy: default-src 'self' *.trusted.com
```

### 示例3

一个网站管理者允许网页应用的用户在他们自己的内容中包含来自任何源的图片，但是限制音频或视频需从信任的资源提供者（获得），所有脚本必须特定主机服务器获取可信的代码。

```
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src usescripts.example.com
```

在这里，各种内容默认仅允许从文档所在的源获取，但存在如下例外：

- 图片可以从任何地方加载
- 多媒体文件仅允许从media1.com和media2.com加载（不允许从这些站点的子域名）。
- 可运行脚本仅允许来自于usescripts.example.com

### 示例4

一个线上银行网站的管理者想要确保网站的所有内容都要通过SSL方式获取，以避免攻击者窃听用户发出的请求。

```
Content-Security-Policy: default-src https://onlinebanking.jumbobank.com
```

该服务器仅允许通过HTTPS方式从onlinebanking.jumbobank.com域名来访问文档。

### 示例5

一个在线邮箱的管理者想要允许在邮件里包含HTML，同样图片允许从任何地方加载，但不允许js或者其他潜在的危险内容（从任意位置加载）。

```
Content-Security-Policy: default-src 'self' *.mailsite.com; img-src *
```

注意这里没有指定`script-src`。在此CSP示例中，站点通过`default-src`指令对其进行配置，这也同样意味着脚本文件仅允许从原始服务器获取。

## 对策略进行测试

为降低部署成本，CSP 可以部署为*报告 (report-only)*模式。在此模式下，CSP 策略不是强制性的，但是任何违规行为将会报告给一个指定的 URI 地址。此外，一个报告模式的头部可以用来测试一个修订后的未来将应用的策略而不用实际部署它。

## 启用违例报告

## 违例报告对语法

## 违例报告样本

