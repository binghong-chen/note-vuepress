# React Router

[https://juejin.cn/post/6886290490640039943](https://juejin.cn/post/6886290490640039943)

react-router-dom react-router history 的关系：

history 是 react-router 的核心，也是整个路由原理的核心，里面集成了 popState,pushState等底层路由实现的原理方法

react-router 是 react-router-dom 的核心，里面封装了 Router、Route、Switch 等核心组件，实现了<font color="red">从路由的改变到组件的更新</font>的核心功能，我们的项目只需引用一次 react-router-dom 就可以了

react-router-dom †在 react-router 的核心基础上，添加了用于跳转的 Link 组件，和 history 模式下的 BrowserRouter 和 hash 模式下的 HashRouter 组件等。所谓的 BrowserRouter 和 HashRouter，也不过是用了 history 库中的 createBrowserHistory 和 crateHashHistory 方法

history模式、hash模式

## history

- pushState
- replaceState
- popstate

## hash

- window.location.hash
- onhashchange

## 使用Demo

```jsx
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom'

import Detail from '../src/page/detail'
import List from '../src/page/list'
import Index from '../src/page/home/index'

const menusList = [
  {
    name: '首页',
    path: '/index'
  },
  {
    name: '列表',
    path: '/list'
  },
  {
    name: '详情',
    path: '/detail'
  },
]
const index = () => {
  return <div>
  	<Router>
    	<div>
      	{
          /* link 路由跳转 */
          menusList.map(router => <Link key={router.path} to={router.path}>
                        <span className="routerLink">{router.name}</span>
                        </Link>)
        }
      </div>
      <Switch>
      	<Route path={'/index'} component={Index}></Route>
        <Route path={'/list'} component={List}></Route>
        <Route path={'/detail'} component={Detail}></Route>
        { /* 路由不匹配，重定向到/index */ }
        <Redirect from='/*' to='/index' />
      </Switch>
    </Router>
  </div>
}
```

## 理解history库

### 1. createBrowserHistory

#### 1.1 总览

```js
const PopStateEvent = 'popstate'
const HashChangeEvent = 'hashchange'
/* 这里简化了createBrowserHistory，列出了几个核心api及其作用 */
function createBrowserHistory() {
  /* 全局history */
  const globalHistory = window.history
  /* 处理路由转换，记录了listens信息 */
  const transitionManager = createTransitionManager()
  /* 改变location对象，通知组件更新 */
  const setState = () => { /* ... */ }
  
  /* 处理path改变后，处理popstate变化的回调函数 */
  const handlePopState = () => { /* ... */ }
  
  /* history.push方法，改变路由，通过全局对象history.pushState改变url，通知router触发更新，替换组件 */
  const push = () => { /* ... */ }
  
  /* 底层应用事件监听器，监听popstate事件 */
  const listen = () => { /* ... */ }
  return {
    push,
    listen,
    /* ... */
  }
}
```

#### 1.2 setState

```js
const setState = (nextState) => {
  /* 合并信息 */
  Object.assign(history, nextState)
  history.length = globalHistory.length
  /* 通知每一个listens 路由已经发生了变化 */
  transitionManager.notifyListeners(
  	history.location,
    history.action
  )
}
```

#### 1.3 listen

```js
const listen = (listener) => {
	/* 添加listen */
  const unlisten = transitionManager.appendListener(listener)
  checkDOMListeners(1)
  
  return () => {
    checkDOMListeners(-1)
    unlisten()
  }
}

const checkDOMListeners = (delta) => {
  listenerCount += delta
  if (listenerCount === 1) {
    addEventListener(window, PopStateEvent, handlePopState)
    if (needsHashChangeListener) {
      addEventListener(window, HashChangeEvent, handleHashChange)
    }
  } else if (listnerCount === 0) {
    removeEventListener(window, PopStateEvent, handlePopState)
    if (needsHashChangeListener) {
      removeEventListener(window, HashChangeEvent, handleHashChange)
    }
  }
}
```

