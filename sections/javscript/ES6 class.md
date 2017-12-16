## Class 继承的过程

### 问题来源在以下代码

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

### Babel转码

```javascript
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var str = 'nihao';

var Parent = function () {
    function Parent() {
        _classCallCheck(this, Parent);

        this.prop = 'Parent';
    }

    _createClass(Parent, [{
        key: 'prop',
        get: function get() {
            return str;
        },
        set: function set(value) {
            str = value;
        }
    }]);

    return Parent;
}();

var Child = function (_Parent) {
    _inherits(Child, _Parent);

    function Child() {
        _classCallCheck(this, Child);

        var _this = _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).call(this));

        _this.prop = 'child';
        return _this;
    }

    return Child;
}(Parent);

var child = new Child();
```

其实本质上还是通过原型链进行继承，且在继承的时候增加了静态方法继承
且调用父类构造函数将父类私有属性一并复制到子类实例上，再通过子类构造函数
