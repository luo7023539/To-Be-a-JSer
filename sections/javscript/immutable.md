## immutable.js

### 纯函数、副作用、immutable

* 纯函数要求函数输入输出一一对应、无副作用、且依赖透明
* `immutable`使得对对象的修改无副作用

```javascript
function keyLog(touchFn) {
  let data = { key: 'value' };
  f(data);
  console.log(data.key); 
}
```
除非明确`f`为纯函数，否则无法确定

引用赋值虽然节省内存，但也造成了状态不可控
```javascript
var foo = {a: 1};
var bar = foo;
bar.a = 2;
foo.a // 2
```

`Immutable`则不一样

```javascript
var foo = Immutable.Map({ a: 1 });
bar = foo.set('a', 2);
foo.get('a') // 1
```

`store`当中经常遇到这样的代码

```javascript
return [
   ...oldArr.slice(0, 3),
   newValue,
   ...oldArr.slice(4)
];
```

更换写法
```javascript
...
return oldArr.set(4, newValue);
```

### 结构共享、对象代理

`seamless-immutable`

vs

`immutable.js`

[Immutable 结构共享是如何实现的？](https://github.com/dt-fe/weekly/issues/14)


### 项目意义

`React`中优化的大招`shouldComponentUpdate`

```javascript
{
    shouldComponentUpdate(nextProps = {}) { // 使用Immutable 比较两个List 是否相等
    const props = this.props;
    return !(
      immutable.is(nextProps.matrix, props.matrix) &&
      immutable.is(
        (nextProps.cur && nextProps.cur.shape),
        (props.cur && props.cur.shape)
      ) &&
      immutable.is(
        (nextProps.cur && nextProps.cur.xy),
        (props.cur && props.cur.xy)
      )
    ) || this.state.clearLines
    || this.state.isOver;
  }
}
```

[俄罗斯方块](https://github.com/chvin/react-tetris)

统计 - 游戏结束过场

限制`CPU`情况下，可以看到丢帧跟fps的区别