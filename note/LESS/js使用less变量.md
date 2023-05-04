# js使用less变量
[https://blog.csdn.net/qq873113580/article/details/123134279](https://blog.csdn.net/qq873113580/article/details/123134279)

less

```less
//插件默认主题变量+这些变量必须在themejs里面定义好
@primary-color: #1890ff; // 全局主色
//自定义样式
@header-item-hover-color:blue;//头部项浮动颜色
@header-back-color:#1890ff;//头部底色
 
// 导出变量
:export {
    primaryColor: @primary-color; 
}
```

main引用

```js
//全局样式变量
import variables from './theme/variables.less';
```