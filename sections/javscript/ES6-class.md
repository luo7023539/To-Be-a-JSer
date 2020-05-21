## Class 继承的过程

### 问题来源在以下代码

```javascript
let str = 'nihao';
class Parent {
    // 实例属性
    prop = 'parent'

    constructor() {
      this.prop = 'Parent'
    }
    get prop() {
        return str ;
    }
    set prop(value) {
        str = value;
    }

    // 静态方法
    static func () {

    }

    // 靠命名区分的私有方法
    _self () {

    }
    // 原型方法
    outer () {

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

~~在父类prop属性设置set、get后，当子类实例再设置该属性发现触发set、get，且子类实例上不存在该私有方法~~

有点蛋疼，问题其实就是当父类设置set、get以后，子类对同名属性修改均为对父类原型该属性的修改，同时触发父类set、get

并且，当子类重新设置set、get以后，仅仅只触发子类的set、get


~~拜读阮大ES6，
ES5的继承，
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
然后再用子类的构造函数修改this~~


### Babel

```javascript
'use strict';

// 解决es6的class简便写法的问题
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            // 默认均为不可枚举
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    // 
    return function (Constructor, protoProps, staticProps) {
        if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
            defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var str = 'nihao';

var Parent = function () {
    function Parent() {
        _classCallCheck(this, Parent);

        this.prop = 'Parent';
    }

    // 蛋疼就在这里
    // get、set通过defineProperty设置到Parent.prototype上面
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
    // 继承的时候
    // Child.prototype指向一个由Object.create(Parent.prototype)的实例
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

所以。。。

这个问题从babel的实现上面其实是找不到答案的
如果从原型链检索的角度来说的话
父类某属性存在`set`/`get`的时候，若不进行触发，实现也不合理

所以
当问题更加复杂的时候

比如子类自身也对该属性设置`set`/`get`，这时候仅仅触发子类的
这倒是合理的，`child`原型上即存在set、get自然就不向上检索
