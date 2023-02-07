# HTTP 请求跨域问题

https://www.zhihu.com/question/440812545/answer/2379426038

## 1. 跨域的原理

**跨域**，是指<font color=red>浏览器</font>不能执行其他网站的脚本。它是浏览器的<font color=red>同源策略</font>造成的

**同源策略**，是浏览器对js 实施的安全限制，只要协议、域名、端口有任何一个不同，都被当作是不同的域

**跨域原理**，即是通过各种方式，避开浏览器的安全限制

## 2. 解决方案

1. jsonp
2. cros
3. proxy