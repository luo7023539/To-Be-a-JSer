## Closure、GC、Memory Leak

### Closure

在了解闭包之前有几个概念需要了解:

* 词法作用域

简单地说,词法作用域就是定义在词法阶段的作用域。换句话说,词法作用域是由你在写 代码时将变量和块作用域写在哪里来决定的,因此当词法分析器处理代码时会保持作用域不变。


* 函数作用域

在ES5标准中,仅支持函数作用域,在任意代码片段外部添加包装函数,可以将内部的变量和函数定义“隐藏”起来,外部作用域无法访问包装函数内部的任何内容。

##### 下面看一些代码

```
function foo() {
    var a = 2;
    function bar() { 
        console.log( a );
     }
    return bar; 
}
var baz = foo();
baz(); // 2 —— 朋友,这就是闭包的效果。
```

这里很明显创建了闭包。

但是闭包到底是什么?

这大概是我看到的对闭包最好的解释!!!

闭包是对函数词法作用域的引用。

当函数在定义时的词法作用域以外的地方被调用。

闭包使得函数可以继续访问定义时的词法作用域。

**无论通过何种手段将内部函数传递到所在的词法作用域以外,它都会持有对原始定义作用 域的引用,无论在何处执行这个函数都会使用闭包。**

```
function foo() { 
    var a = 2;
    function baz() { 
        console.log( a ); // 2
    }
    bar( baz ); 
}
function bar(fn) {
    fn(); // 妈妈快看呀,这就是闭包!
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
    fn(); // 妈妈快看呀,这就是闭包!
 }
 foo();
 bar(); // 2
```


在定时器、事件监听器、 Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步(或者同步)任务中,只要使 用了回调函数,实际上就是在使用闭包!

### GC

这部分规则较多,就不敢给大家安利太多东西!

当一个对象被一个根对象或另一个活对象指向,该对象为活对象。

* 根对象永远是活对象，它是被浏览器或V8所引用的对象。
* 被局部变量所指向的对象也属于根对象，因为它们所在的作用域对象被视为根对象。
* 全局对象（Node中为global，浏览器中为window）自然是根对象。
* 浏览器中的DOM元素也属于根对象

隆重推出!!!

__[浅谈V8引擎中的垃圾回收机制](https://segmentfault.com/a/1190000000440270)__

__[V8 之旅： 垃圾回收器](http://newhtml.net/v8-garbage-collection/)__


### Memory Leak

根据上面的一些规则做一些例子

如何挤爆浏览器或者node内存

可以通过node直接跑

```javascript
let arr = [];
while(true)
  arr.push(1);
```

```javascript
let arr = [];
while(true)
  arr.push();
```

以下这个可以略过

如果 push 的是 `Buffer` 会有所区别

```javascript
let arr = [];
while(true)
  arr.push(new Buffer(1000));
```

接下来通过例子熟悉一下~

##  Refer To

* Closure --->   你不知道的Javascript
