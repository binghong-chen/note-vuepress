# 搞不懂路由跳转？带你了解history.js实现原理

[https://zhuanlan.zhihu.com/p/587025328](https://zhuanlan.zhihu.com/p/587025328)

![搞不懂路由跳转？带你了解 history.js 实现原理](./assets/v2-880c077dc0a91af68891dbb5005e456b_720w.jpg)

## 基于browser history 的路由管理原理

首先我们解读createBrowserHistory主逻辑：

```typescript
export function createBrowserHistory(
	options: BrowserHistoryOptions = {}
): BrowserHistory {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;
  // 省略大量逻辑...
  let history: Brow
}
```

