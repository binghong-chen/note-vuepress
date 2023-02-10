# useReducer学习

[https://www.jianshu.com/p/14e429e29798](https://www.jianshu.com/p/14e429e29798)

类似Redux的功能

引入useReducer后，可以接受一个reducer函数作为参数，reducer函数接受两个参数：

1. state
2. action

返回 

1. state
2. dispatch

```jsx
import React, {useReducer} from 'react'

export default function ReducerDemo() {
  const [count, dispatch] = useReducer((state, action) => {
    switch(action) {
      case 'add':
        return state + 1
      case 'sub':
        return state - 1
      default:
        return state
    }
  }, 0)
  return <div>
  	<h1 className="title">{count}</h1>
    <button className="btn is-primary"
      onClick={()=>dispatch('add')}>Increment</button>
    <button className="btn is-warning"
      onClick={()=>dispatch('sub')}>Decrement</button>
  </div>
}
```

```jsx
import React, {useReducer, useRef} from 'react'

export default function ShoppingList() {
  const inputRef= useRef()
  const [items, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'add':
        return [...state,
               {
                 id: state.length,
                 name: action.name
               }]
      case 'remove':
        return state.filter((_, index) => index !== action.index)
      case 'clear':
        return []
      default:
        return state
    }
  }, [])
  
  function handleSubmit(event) {
    event.preventDefault()
    dispatch({
      type: 'add',
      name: inputRef.current.value
    })
    inputRef.current.value = ''
  }
  
  return <>
  	<form onSubmit={handleSubmit}>
  		<inptu ref={inputRef} />
  	</form>
  	<button
      className="btn is-danger"
      onClick={()=>dispatch({type: 'clear'})}
      >clear</button>
  	<ul>
  		{items.map((item, index)=><li key={item.id}>{item.name}
                 <button className="btn"
                   onClick={()=>dispatch({type: 'remove', index})}
                 </li>)}
  	</ul>
  </>
}
```

这里值得说一下就是 ...state 这是每一次我们需要 copy 一个 state 然后修改 state 而不是在 state 原有对象进行修改。这就是 <font color='red'>immutable </font>数据吧。