# React 类组件 生命周期详细

MOUNTING UPDATING UNMOUNT

Render Per-commit Commit

constructor(props, context, updater)

- props read-only
- context
- updater
  - this.setState --> this.updater.enqueueSetState
  - this.forceUpdate --> this.updater.enqueueForceUpdate

在constructor中一般setState 和 bind 函数 （这个可以用箭头函数替代）