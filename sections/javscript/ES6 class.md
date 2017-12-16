## Class 继承的过程

问题来源在以下代码

```javascript
let str = 'nihao';
class Parent {
    constructor() {
      this.prop = 'Parent'
    }
    get prop() {
        return str ;
    }
    set prop(value) {
        str = value;
    }
}

class Child extends Parent{
    constructor(){
        super();
        console.log('Child');
    }
}

let child = new Child()

child.prop = 'child'
console.log(child.hasOwnProperty('prop'))
```

在父类prop属性设置set、get后，当子类实例再设置该属性发现出发set、get，且子类实例上不存在该私有方法

拜读阮大ES6，

ES5的继承，
实质是先创造子类的实例对象this
然后再将父类的私有属性添加到this上面
最后来改变原型链的指向
但也会有一些问题
假设父类构造函数上存在计数
这也会导致计数不准确的问题

ES6的继承机制完全不同
实质是先创造父类的实例对象this
所以必须先调用super方法
（即便子类没有书写constructor也会默认添加）
然后再用子类的构造函数修改this

```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B

```
上面代码中，子类B的构造函数之中的super()，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。

注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B，因此super()在这里相当于A.prototype.constructor.call(this)。

上面代码中，new.target指向当前正在执行的函数。可以看到，在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。