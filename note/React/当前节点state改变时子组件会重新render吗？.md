# 当前节点state改变时子组件会重新render吗？

默认会，但如果子组件的shouldComponetUpdate 返回 false，则该子组件不会。

使用 this.props.children这样注入的，不会重新渲染（this.props.xxx 是父节点传递下来的，当前节点不会更改props.xxx，只会更改自身的 state，故不会触发 父节点传入的props的变更，不会重新渲染）

但是this.props.items.map 会在当前节点中重新执行生成新的子节点，这些子节点会重新渲染（当当前节点state改变时）

```jsx
import React from "react";

export default class ChildrenRenderCheckerRoot extends React.Component {
    render() {
        return <ChildrenRenderChecker name="1" items={[1, 2, 3]}>
            <ChildrenRenderChecker name="1-1">
                <ChildrenRenderChecker name="1-1-1">
                </ChildrenRenderChecker>
                <ChildrenRenderChecker name="1-1-2">
                </ChildrenRenderChecker>
            </ChildrenRenderChecker>
            <ChildrenRenderChecker name="1-2">
            </ChildrenRenderChecker>
        </ChildrenRenderChecker>
    }
}

class ChildrenRenderChecker extends React.Component {
    state = { count: 0 }
    click = () => this.setState({ count: this.state.count + 1 })

    render() {
        console.log('ChildrenRenderChecker ', this.props);
        return <>
            <h1 style={{ display: 'inline-block', marginRight: 8 }}>{this.props.name}</h1>
            <button onClick={this.click}>{this.state.count}</button>
            <div style={{ marginLeft: 24 }}>{this.props.children}</div>
            <Child1 />
            <Child2 />
            {
                this.props.items
                && <div style={{ marginLeft: 24, backgroundColor: 'yellow' }}>
                    {this.props.items.map(item => <React.Fragment key={'child-' + item} >
                        <Child1 />
                        <Child2 />
                    </React.Fragment>)}
                </div>
            }
        </>
    }
}

class Child1 extends React.Component {
    render() {
        console.log('Child1 render')
        return <div>Child1 {Math.random()}</div>
    }
}

class Child2 extends React.Component {
    shouldComponentUpdate() {
        return false
    }
    render() {
        console.log('Child2 render')
        return <div>Child2 {Math.random()}</div>
    }
}

// Child3 永远不会重新渲染 相当于 Child2
class Child3 extends React.PureComponent {
   render() {
        console.log('Child3 render')
        return <div>Child3 {Math.random()}</div>
    }
}
```

