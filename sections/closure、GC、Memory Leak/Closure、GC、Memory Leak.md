## Closure、GC、Memory Leak

### Closure

在了解闭包之前有几个概念需要了解:

如需要跳过本章请直接打开[clear](example/clear.html):

浏览器运行且查看内存快照~有惊喜!

* 请勿在已经产生闭包的作用域内再次创建闭包!!!
* 请勿在已经产生闭包的作用域内再次创建闭包!!!
* 请勿在已经产生闭包的作用域内再次创建闭包!!!
* 请勿在已经产生闭包的作用域内再次创建闭包!!!

#### 词法作用域

简单地说,词法作用域就是定义在词法阶段的作用域

换句话说,词法作用域是由你书写代码的位置决定

#### 函数作用域

在ES5标准中,仅支持函数作用域,才会大量采用`IFFE`来产生闭包

##### 下面看一些代码

```javascript
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

### 闭包是对函数词法作用域的引用

`foo`作用域中的变量`a`在`foo`执行完毕以后还需要使用

那么这时候`foo`作用域不能销毁

所以就产生了闭包

**只要将当前作用中的变量传递到所在的作用域以外,它都会持有对原始定义作用域的引用,无论在何处执行这个函数都会使用闭包。**

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
    fn(); // 妈妈快看呀,这也产生闭包!
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

在定时器、事件监听器、 Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步(或者同步)任务中

只要使用了回调函数,实际上就是在使用闭包!

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

也就是所,根对象及活对象都会不断增加内存暂用

造成内存泄露更多还是因为闭包!

* DOM被移除后,其绑定事件所引用的变量会自动清除（IE可能存在问题）
* 谨慎使用闭包


```javascript
function foo() {
    var a = 2;
    return function bar() { 
               console.log( a );
           } 
}
var baz = foo();
baz(); 
```

正常情况下,我们这样使用闭包,用来保存某些变量的引用,保证变量私有,或者实现模块化

但是在某一些情况下,我们也会在不经意间产生闭包

示例当中有示范


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

这个有一个比较好的解释!

在运行阶段作用域中创建的闭包是共享的!

也就是说,在函数内部创建函数,存在某个函数引用外部变量,且有函数暴露到外部,不论这是两个不同的函数,或者是同一个,所有被引用的变量都会无法被浏览器垃圾回收!

在会产生闭包的函数中,建议手动将不需要的对象手动清楚

在有的时候,闭包也会造成一些比较严重的问题!

例如Clear当中的示例

看了示例以后会有一种坑到自己的感觉!!!!

示例:

1. [error](example/error.html)
2. [Closure](example/Closure.html)
3. [DOM_REMOVE](example/DOM_REMOVE.html)
4. [clear](example/clear.html)

* 请勿在已经产生闭包的作用域内再次创建闭包!!!
* 请勿在已经产生闭包的作用域内再次创建闭包!!!
* 请勿在已经产生闭包的作用域内再次创建闭包!!!
* 请勿在已经产生闭包的作用域内再次创建闭包!!!
##  Refer To

* Closure --->   你不知道的Javascript
