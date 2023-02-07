# Redux

## reducer

形式为 (state, action) => state 的纯函数

## 3个API

- createStore
- subscribe
- dispatch

## Why?

状态在组件数中多个节点使用（关系较远，使用context和props比较麻烦）

为什么不使用全局变量或者全局存储？不能通知更新

## 核心概念

如果要管理的state很复杂，可以拆成 若干 小的 state，使用单独的函数管理

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
    if (action.type === 'SET_VISIBILITY_FILTER') return action.filter
    return state
}
function todos(state = [], action) {
    switch (action.type) {
        case 'ADD_TODO':
            return state.concat([{ text: action.text, completed: false }])
        case 'TOGGLE_TODO':
            return state.map((todo, index) =>
                action.index === index
                    ? { text: todo.text, completed: !todo.completed }
                    : todo
            )
        default:
            return state
    }
}
function todoApp(state = {}, action) {
    return {
        todos: todos(state.todos, action),
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    }
}
```

## 三大原则

### 单一数据源

整个应用的state被存在一个object tree 中，而这个 object tree 只存在唯一一个store中

```js
store.getState()
```

### State只读

唯一改变state的方法就是触发action，action是一个描述怎么改变state的对象

why？可以确保其他地方（视图、网络）不能直接修改state，只有表达清楚修改的意图（通过action），才能修改。修改会集中处理（严格按照一个一个的顺序执行，**防止竞态** race condition）

```js
store.dispatch({
	type: 'COMPLETE_TODO',
	index: 1
})
store.dispatch({
	type: 'SET_VISIBILITY_FILTER',
	filter: 'SHOW_COMPLETED'
})
```

### 使用纯函数来执行修改

为了描述 action 如何改变 state tree，编写 reducers

一个reducer是 一个 (state, action) => state 的纯函数

可以拆分写多个 reducer 来处理state，可以使用 combineReducers 来合并reducers成一个

```js
const { combineReducers, createStore } = require('redux')

let reducer = combineReducers({visibilityFilter, todos})
let store = createStore(reducer)
```

### state结构设计

- 数据相关的state和UI相关的state分开
- 关联使用id关联，避免直接引用对象

### action处理

- 纯函数，相同的参数，得到相同的结果，单纯的计算
- 不要修改传入参数
- 不要执行副作用操作，如API请求、路由跳转
- 调用非纯函数，如Date.now() Math.random()
