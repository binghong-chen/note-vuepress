# JavaScript深入之new的模拟实现
[https://github.com/mqyqingfeng/Blog/issues/13](https://github.com/mqyqingfeng/Blog/issues/13)
## new
一句话介绍new：

> new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一

也许有点难懂，我们在模拟new之前，先看看new实现了哪些功能。

举个例子：

```js
// Otaku 御宅族，简称宅
function Otaku(name, age) {
  this.name = name;
  this.age = age;
  
  this.habit = 'Games';
}

Otaku.prototype.strength = 60;

Otaku.prototype.sayYourName = function() {
  console.log(' I am ' + this.name);
}

var person = new Otaku('Kevin', '18');

console.log(person.name);			// Kevin
console.log(person.habit);		// Games
console.log(person.strength);	// 60

person.sayYourName();	// I am Kevin
```

从这个例子中，我们可以看到，实例person可以：

1. 访问到Otaku构造函数里的属性
2. 访问到Otaku.prototype中的属性

接下来，我们可以尝试模拟一下了。

因为 new 是关键字，所以无法像bind函数一样直接覆盖，所以我们写成一个函数，命名为objectFactory，来模拟new的效果，用的时候是这样的：

```js
function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  Constructor.apply(obj, arguments);
  return obj;
}
```

在这一版中，我们：

1. 用new Object()的方式新建了一个对象obj
2. 取出第一个参数，就是我们要传入的构造函数。此外因为shift会修改原数组，所以arguments会被删除第一个参数
3. 将obj的原型指向构造函数，这样obj就可以访问到构造函数原型中的属性（prototype）
4. 使用apply，改变构造函数this的指向到新建的对象，这样obj就可以访问到构造函数中的属性（own）
5. 返回obj

```js
function Otaku (name, age) {
    this.name = name;
    this.age = age;

    this.habit = 'Games';
}

Otaku.prototype.strength = 60;

Otaku.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}

function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj, arguments);
    return obj;
};

var person = objectFactory(Otaku, 'Kevin', '18')

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60

person.sayYourName(); // I am Kevin
```

## 返回值效果实现

接下来我们再来看一种情况，加入构造函数有返回值，举个例子：

```js
function Otaku(name, age) {
  this.strength = 60;
  this.age = age;
  
  return {
    name: name,
    habit: 'Games'
  }
}

var person = new Otaku('Kevin', '18');

console.log(person.name)	// Kevin
console.log(person.habit) // Games
console.log(person.strength) // undefined
console.log(person.age) // undefined
```

在这个例子中，构造函数返回了一个对象，在实例person中只能访问返回对象中的属性。

而且还要注意一点，在这里我们是返回了一个对象。加入我们只是返回了一个基本类型的值呢？

再举个例子：

```js
function Otaku(name, age) {
  this.strength = 60;
  this.age = age;
  
  return 'handsom boy';
}

var person = new Otaku('Kevin', '18');

console.log(person.name)	// undefined
console.log(person.habit)	// undefeind
console.log(person.strength)	// 60
console.log(person.age)		// 18
```

结果完全颠倒过来，这次尽管有返回值，但是相当于没有返回值。

所以我们还需要判断返回值是否是一个对象，如果是一个对象，我们就返回这个对象，如果不是，我们就该返回什么就返回什么。

第二版代码：

```js
function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === 'object' ? ret : obj;
}
```

