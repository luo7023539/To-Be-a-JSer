## 数组

### Javascript中的数组

数组的标准定义是:一个存储元素的线性集合(collection),元素可以通过索引来任意存 取,索引通常是数字,用来计算元素之间存储位置的偏移量。

几乎所有的编程语言都有类 似的数据结构。然而 JavaScript 的数组却略有不同。

Javascript中数组的底层实现其实是特殊的对象。

而对象在Javascript中又是哈希表的实现,故数组就成为一段不连续的内存,非常类似于链表这种结构。

且提供大量的方法用于模拟其他数据结构件

* 通过push、pop方法模拟栈
* 通过push、unshift方法模拟队列
* 通过

### 主要优化

1. 类型优化

在运行Javascript代码时,V8会追踪数组中的每一项,通过这些信息,对数组方法进行优化。

举以下例子:

在Javascript层面,其不区分整形、浮点数、双精度

然而,在引擎级别,我们可以做出更加精确的区分

```javascript
    const array = [1,2,3]
    // PACKED_SMI_ELEMENTS
    
    array.push(4.56)
    
    // PACKED_DOUBLE_ELEMENTS
    
    array.push('x')
    
    // PACKED_ELEMENT
    
```

* 小整型,Smi
* 双精度浮点数,浮点数和不能表示位Smi的整数
* 常规元素,不能表示为Smi或双精度的值

元素类型的转换只能从一个方向进行

如上方的从Smi -- DOUBLE -- ELEMENT的方向

2. 密集型数组及稀疏数组

```javascript
    const array = [1, 2, 3, 4.56, 'x'];
    // PACKED_ELEMENT
    array.length  // 5
    
    array[9] = 1;
    // array[5] until array[8] now holey    

```

常见元素种类PACKED数组的操作比HOLEY数组上的操作更为有效。

且数组可以从`PACKED`过度到`HOLEY`

##### 性能提示

* 避免创建HOLEY

```javascript
    const array = new Array(3)
    // 被标记为HOLEY_SMI_ELEMENT
    
    array[0] = 'a'
    array[1] = 'b'
    array[2] = 'c'
    
    // HOLEY_ELEMENT
```

```javascript
    const array = ['a','b','c']
    
    // 当不明其中项时
    
    const _array = []
    
    _array.push(value)
    _array.push(value)
```

* 避免读取数组长度以外项

```javascript
    const array = [1,2,3]
    
    array[4] 
    // 将从原型链上查询
    
    for(let i = 0; item; (item = item[i]) !== null; i++){
        doSomething(item)
    }
```

* 避免类型转换

需要在数组当中进行大量的操作,可考虑规范化内部元素

```javascript
     const array = [1,2,3]
     
     array.push(-0)
     array.push(null)
     array.push(Infinity)
     /*
        -0 -- null -- Infinity 等均会将其转化位
        PICKED_DOUBLE_ELEMENT
     */
```

* 类数组 vs 数组

在Javascript中某些对象也类似数组格式,但不具备相应的方法

也可借用数组方法进行操作

如果需要进行多次操作也考虑进行转化

ES6 - 中提供的 rest params可以优雅地进行响应的操作

避免使用arguement
```javascript
    const logArgs = (...args) => {
        // args 可通过数组原型查找到相应的方法
        args.forEach((i) => console.log(i))
    }
```

* 避免多态

针对存在多种类型形态的数组,调用原生方法的效率代替用户自定义的函数库

```javascript
    const array = [1,'x']
    // PACKED_ELEMENT
    
    const each = function(array, fn) {
        for(let i = 0, len = array.length;i < len;i++){
            fn.call(array[i], array[i], i, array)
        }
    }
```