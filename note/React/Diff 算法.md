# Diff 算法

1. 把树形结构按照层级分解，只比较同级元素
2. 把列表结构的每个单元添加唯一key属性，方便比较
3. React只会匹配相同class的component（这里的class指的是组件的名字）
4. 选择性子树渲染。开发人员可以重写shouldComponentUpdate提高diff性能