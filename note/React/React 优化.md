# React 优化

## PureComponent

实现原理：

```tsx
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
}
```

而  `shallowEqual` 又做了什么呢？会比较  `Object.keys(state | props)` 的长度是否一致，每一个  `key` 是否两者都有，并且是否是一个引用，也就是只比较了第一层的值，确实很浅，所以深层的嵌套数据是对比不出来的。

## shouldComponentUpdate

📜 **语法**：`shouldComponentUpdate(nextProps, nextState)`

💡 **使用建议**：

- 如果性能是个瓶颈，尤其是有几十个甚至上百个组件的时候，使用 `shouldComponentUpdate` 可以优化渲染效率，提升应用的性能；
- 使用 `React.PureComponent` 组件基类能自动实现一个 `shouldComponentUpdate` 生命周期钩子，可以默认为组件更新校验，但是只会对更新数据进行浅层对照；
- 在对 `this.props` 和 `nextProps` 以及 `this.state` 和 `nextState` 进行比较时需要注意引用类型的坑；
- 通常用于条件渲染，优化渲染的性能。

⚠️ **注意事项**：

- 此钩子函数在初始化渲染和使用了 `forceUpdate` 方法的情况下不会被触发，使用 `forceUpdate` 会强制更新
- 请勿在此函数中使用 `setState` 方法，会导致循环调用。

## React.memo

React.memo是一个高阶组件（HOC），实现效果与PureComponent类似，不同点：

- React.memo用于函数组件
- React.PureComponent用于类组件
- React.PureComponent只是浅比较props, state，React.memo也是浅比较，但它可以自定义比较函数

```tsx
export function memo<Props>(
  type: React$ElementType,
  compare?: (oldProps: Props, newProps: Props) => boolean
) {
  // do something
  const elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare: compare === undefined ? null : compare,
  };
  // do something
  return elementType;
}
```

### 示例

```jsx
function MyComponent(props) {
  /* 使用 props 渲染 */
}

// 比较函数
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false

  返回 true，复用最近一次渲染
  返回 false，重新渲染
  */
}

export default React.memo(MyComponent, areEqual);
```

### 说明：

- 函数返回值为 `true` 时复用最近一次渲染，否则 `false` 重新渲染

### ⚠️注意

- 如果不通过比较函数进行比较，那么依然是一种对象的浅比较，有复杂对象时无法重新渲染

## useMemo

把 **创建** 函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 `memoized` 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

语法：

```jsx
const memoizedValue = useMemo(compute, dependencies);
```

类型声明：

```tsx
export function useMemo<T>(create: () => T, deps: Array<mixed> | void | null): T {
  const dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
```

代码示例：

```tsx
const memoizedResult = useMemo(() => {
  return expensiveFunction(propA, propB);
}, [propA, propB]);
```

```jsx
import React, { useState, useMemo } from 'react';

function slowFunction(num) {
  console.log('Calling Slow Function');
  for (let i = 0; i <= 1000000000; i++) {}
  return num * 2;
}

const SlowComponent = () => {
  const [value, setValue] = useState(0);
  const [dark, setDark] = useState(false);

  // Bard
  const doubleNumber = slowFunction(value);

  const themeStyles = {
    color: dark ? 'red' : 'black',
  };

  return (
    <>
      <h3>Slow Component</h3>
      <input type="number" value={value} onChange={(e) => setValue(parseInt(e.target.value))} />
      <button onClick={() => setDark((prevDark) => !prevDark)}>Change Theme</button>
      <div style={themeStyles}>{doubleNumber}</div>
    </>
  );
};

const MemoComponent = () => {
  const [value, setValue] = useState(0);
  const [dark, setDark] = useState(false);

  // Good
  const doubleNumber = useMemo(() => {
    return slowFunction(value);
  }, [value]);

  const themeStyles = {
    color: dark ? 'red' : 'black',
  };

  return (
    <>
      <h3>Memo Component</h3>
      <input type="number" value={value} onChange={(e) => setValue(parseInt(e.target.value))} />
      <button onClick={() => setDark((prevDark) => !prevDark)}>Change Theme</button>
      <div style={themeStyles}>{doubleNumber}</div>
    </>
  );
};

const App = () => {
  return (
    <>
      <SlowComponent />
      <br />
      <MemoComponent />
    </>
  );
};

export default () => <App />;
```

