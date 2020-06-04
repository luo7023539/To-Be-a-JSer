## Closure、GC、Memory Leak

在了解闭包之前有几个概念需要了解:

### 词法作用域

词法作用域的就是当前函数可以访问的作用域栈由书写的位置来决定

作用域链是一个栈，当函数执行的时候把当前函数作用域压栈顶，执行完毕的时候出栈
```javascript

var a = 0
var _a = -1

function foo0() {
    console.log( a )
}

function foo1() {
    var a = 1;
    function bar() { 
        console.log( a );
     }
    return bar; 
}

function foo2() {
    function bar() {
        var a = 2; 
        console.log( a);
        throw Error("aaa")
        // 报错信息也能看出其中的结构
     }
    return bar; 
}
```

### 函数作用域

在ES5标准中,仅支持函数作用域,为了生成一个单独的`nameSpace`,大量使用IFFE

经常会看到类似这样的代码
```javascript
((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        //CommonJS
        var $ = requie('jquery');
        module.exports = factory($);
    } else {
        root.testModule = factory(root.jQuery);
    }
})(this, ($) => {
    //todo
})
// umd的模块打包

~(function () {

})(jquery)
// 封装jquery插件
```

### GC

这东西太干巴巴了

理解几个要点

1. 正常函数执行完毕，对应的作用域会销毁
2. 浏览器针对能不能销毁有自己一套标记机制

### 闭包

闭包其实就是打破了上面所说GC的第一点

当前作用域的某些变量后续仍然需要使用

那么

浏览器就不能再执行完毕后直接把作用域给销毁掉

怎么做到呢？

自然是需要利用第二点，

告诉浏览器这东西不能丢了

（利用活对象去引用作用域内的变量)

（活对象最常见的就是window、DOM)

```javascript
function foo() {
    var a = 2;
    function bar() {
        console.log( a );
     }
    return bar;
}
var baz = foo(); // 我还要a，不要删了~~
baz(); // 
```

闭包其实就是对作用域的引用。

**内部函数传递到所在的作用域以外,它都会通过闭包来找到当前函数的执行作用域链**

**闭包是词法作用域的必然结果**
```javascript
function foo() {
    var a = 2;
    function baz() {
        console.log( a ); // 2
    }
    bar( baz );
}
function bar(fn) {
    fn(); // 快看呀,这也产生闭包!
}

var fn;
function foo() {
    var a = 2;
    function baz() {
        console.log( a );
    }
    fn = baz; // 将 baz 分配给全局变量
}
function bar() {
    fn(); // 快看呀,这就是闭包!
 }
 foo();
 bar(); // 2
```

闭包解决什么问题?

提供一个纯净的执行作用域

各种`回调函数`、`fp`基础函数`curry`、`compose`......

### Memory Leak

什么内存泄露？

就是你告诉浏览器这东西要留着

然后不需要的时候没有跟它说

接着浏览器傻傻的全部留下来

[demo-1](example/demo-1.html)
```javascript
function foo() {
    var _longStr = new Array(1e7).join('_');
    
    return function bar() { 
               console.log( _longStr );
           } 
}
var baz = foo();
baz(); 
```

接下来把作用域复杂化
[demo-2](example/demo-2.html)
```javascript
    window.onload = function () {
        var div = document.getElementById('div');
        var longStr = new Array(1e7).join('*');

        var useless = function () {
            if(longStr)
                console.log('哈哈!! 我没有被使用 - 也没有被暴露出去');
        };

        div.onclick = function () {
            console.log('我才是被词法作用域外使用的函数')
        }
    };
```

聪明的浏览器
[demo-3](example/demo-3.html)
```javascript
    window.onload = function () {
        var arr = new Array(1e7).fill(0);
        var div = document.getElementById('div');

        div.onclick = function () {
            console.log(arr)
        };
    };

    function removeClick() {
        var div = document.getElementById('div');
        div.onclick = null
    }

    function removeDiv() {
        document.body.removeChild(document.getElementById('div'))
    }
```

已经成为历史的DEMO-4
欲哭无泪又要刷新知识啦
[demo-4](example/demo-4.html)
```javascript
    var theThing = null;

    var replaceThing = function () {
        var originalThing = theThing;
        var _longStr = new Array(1e7).join('_');
        var unused = function () {
            if (originalThing)
                console.log("hi")
        };
        theThing = {
            longStr: new Array(1e7).join('*'),
            func: function () {
            }
        };
    };
```

#### 涉及Vue相关

**仅供参考,DEMO后补**

1. 监听在window/body等事件没有解绑

2. 指令内涉及原生DOM或者定时器未清除

3. `v-if`、路由切换、Store - watch

##  Refer To
