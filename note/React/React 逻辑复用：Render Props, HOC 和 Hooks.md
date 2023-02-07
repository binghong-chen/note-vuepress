# React 逻辑复用：Render Props, HOC 和 Hooks

## render props

props 名不是必须为render

在PureComponent中最好将render函数提成函数，不要在render中直接创建函数，避免抵消PureComponent的优势。

```jsx
function A(props) {
    const sharedLogic = () => { return 'render prop'; }
    const sharedVar = sharedLogic();
    return props.render(sharedVar)
}
function B(props) {
    return <div>hi, {props.sharedVar}</div>
}
function C(props) {
    return <div>hello, {props.sharedVar}</div>
}
export default function RenderProps() {
  return (
    <div className="App">
      <A render={(val) => (<B sharedVar={val}/>)}/>
      <A render={(val) => (<C sharedVar={val}/>)} />
    </div>
  );
}

```

- 优点：数据共享、代码复用，将组件内的state作为props传递给调用者，将渲染逻辑交给调用者。
- 缺点：无法在return语句外访问数据、嵌套写法不够优雅

## HOC

Higher-order component

```jsx
function A(WrappedComponent) {
    return function(props) {
        const sharedLogic = () => { return 'hoc'; }
        const sharedVar = sharedLogic();
        return <WrappedComponent {...props} sharedVar={sharedVar} />
    }
}
function B(props) {
    return <div>hi, {props.sharedVar}</div>
}
function C(props) {
    return <div>hello, {props.sharedVar}</div>
}
const WrappedB = A(B);
const WrappedC = A(C);
export default function HOC() {
  return (
    <div className="App">
      <WrappedB />
      <WrappedC />
    </div>
  );
}
```

- 优点：逻辑复用、不影响被包裹的组件的内部逻辑
- 缺点：HOC传递给被包裹组件的props容易和被包裹后的组件重名，进而被覆盖

## Hooks

自定义hook（将代码封装抽成一个自定义的hook）

```jsx
import { useEffect, useState } from "react";

function useSharedVar(x) {
  const [sharedVar, setSharedVar] = useState("");
  useEffect(() => {
    setSharedVar("custom hook");
  }, []);
  return sharedVar;
}
function B(props) {
  const sharedVar = useSharedVar("b");
  return <div>hi, {sharedVar}</div>;
}
function C(props) {
  const sharedVar = useSharedVar("c");
  return <div>hello, {sharedVar}</div>;
}
export default function Hooks() {
  return (
    <div className="App">
      <B />
      <C />
    </div>
  );
}
```

优点：

- 使用直观
- 解决HOC的prop重名问题
- 解决render props 因数据共享 而出现的嵌套地狱问题
- 能在return之外使用数据

注意：hook只能在组件顶层使用，不可在分支中使用
