# Flex布局

[https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

```css
.box {
	display: flex;
}

.inline-box {
  display: inline-flex;
}
```

设置flex布局后，子元素的`float`、`clear`、`vertical-align`属性将失效

## 6个属性设置在容器上

- flex-direction: row | row-reverse | column | column-reverse 排列方向
- flex-wrap: nowrap | wrap | wrap-reverse 换行
- flex-flow: <flex-direction> || <flex-wrap> 简写 默认值 row no wrap
- justify-content: flex-start | flex-end | center | space-between | space-around
- align-items: flex-start | flex-end | center | baseline | stretch
- align-content: flex-start | felx-end | center | space-between | space-around | stretch 用于换行后的多轴情形

### align-content

需要有两个轴（即有换行情形）

![image-20230417213716768](./assets/image-20230417213716768.png)

## 6个属性在项目上

- order
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self

![image-20230417213642721](./assets/image-20230417213642721.png)
