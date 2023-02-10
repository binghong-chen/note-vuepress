# HTTP Cache如何计算Age

[https://blog.csdn.net/woxueliuyun/article/details/41077671](https://blog.csdn.net/woxueliuyun/article/details/41077671)

这里的Age指的是响应头Age，下面内容有部分翻译，也有部分自己的理解，欢迎讨论。

我们用now表示当前主机的当前时间，用request_time表示缓存发起请求的时间，用response_time表示缓存收到响应的时间。

HTTP/1.1要求源服务器的每一个响应都包含一个Date头信息，表示这个响应被源服务器创建的时间，我们用date_value表示这个Date头的值。

HTTP/1.1使用Age响应头表示从缓存中拿到响应的寿命，我们用age_value表示Age头的值。

<font color=gree>源服务器计算部分：响应执行时间+网络延迟估计</font>

缓存中响应的寿命可以通过两种完全独立的方式计算：

1. 直接用response_time（缓存收到响应的时间）减去date_value（响应被创建的时间），如果<0，就用0替代。
2. 如果响应路径上的所有缓存实现了HTTP/1.1，则直接用age_value值。

但实际上，我们很难保证响应路径上的所有缓存都实现了HTTP/1.1，所以，同时使用这两种方式，然后进行修正，结果会更可靠：

```
corrrect_received_age = max(response_time - date_value, age_value)
```

到这里还没有完成最终计算，correct_received_age只是缓存收到响应时，响应的寿命，没有考虑响应到下一个缓存或客户端的网络延迟时间。

因为网络会有延迟，在传输过程中寿命已经增加了，下一个缓存就得考虑这个因素。对于这个因素，HTTP/1.1采用一种比较保守的计算方法，假设从请求发起到响应的时间就是网络延迟的时间（结果不一定就是实际经过的时间，<font color=gold>用请求延迟估计响应延迟？？？</font>），用response_delay表示：

```
response_delay = response_time - request_time
correct_initial_age = correct_received_age + response_delay
```

response_delay一般指最后一个缓存收到客户端的延误时间，如果响应路径上有多个缓存，不需要迭代，因为correct_received_age是根据缓存收到响应的时间，已经减去了前面的网络延迟。

<font color=gree>缓存服务器计算部分：如果有缓存：还需要加上缓存存储的时间</font>

以上还只是计算响应第一次出现在缓存中时已拥有的寿命，响应一旦被缓存，就可能被多次使用，这时，响应的寿命就得由缓存来计算了。我们用resident_time表示响应在缓存中储存的时间，用current_age表示响应的当前寿命：

```
resident_time = now - response_time
current_age = correct_initial_age + residen_time
```

如果响应路径中有缓存，请求最终受到的响应头Age对应的值时current_age，而不是服务器最初给的Age，因为这个值已经被缓存修改过了。



## 总结：

Age代表的是源服务器真正意义开始处理请求到客户端收到响应的时间估值

- 真正请求：如果是缓存，需要加上缓存时间
- 估值：服务器到客户端的返回时间使用客户端到服务器的请求时间估计的