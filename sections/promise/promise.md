## Promise 

基于Promise/A+（即ES6的Promise的实现）

### 例子

```javascript
    var _task1 = function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve({
              err: 0,
              msg: 'task1'
          })
        })
      })
    }
    
    var _task2 = function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve({
              err: 0,
              msg: 'task2'
          })
        })
      })    
    }
    
    _task1()
        .then(function(data) {
          return _task2()
        })
        .then(function(data) {
          console.log(data)
        })
```

一个Promise常见的用法

#### 基本实现
* 通过new操作符创建Promise实例
* 传入resolver用于创建实例的时候运行
* 将resolve,reject作为参数传入resolver当中
* 通过then方法注册回调

下面实现一个精简版的

```javascript
    function Promise(resolver) {
        var stack = [],
            _value = null;
        this.then = function(onFulfilled) {
           // 把回调推入stack中
           stack.push({
               onFulfilled: onFulfilled
           })
           // 方便链式调用
           return this
        }
        
        function resolve(val) {
            _value = val;
          stack.forEach(function(cbObj) {
            cbObj.onFulfilled(_value)
          })
        }
        
        if(typeof resolver === 'function'){
            resolver(resolve)
        }
    }
```

存在部分问题:

* resolver如果同步调用resolve则then方法还未执行
* then在resolve后调用,应该立即执行该函数

故进行延时、并且加入状态

```javascript
    function Promise(resolver) {
        var stack = [],
            state = 'pending',
            _value = null;
        this.then = function(onFulfilled) {
           // 把回调推入stack中
           handle({
               onFulfilled: onFulfilled
           })
           // 方便链式调用
           return this
        }
        
        function handle(cb) {
          if(state === 'pending'){
              return stack.push(cb)
          }
          
          cb.onFulfilled(_value)
        }
        
        function resolve(val) {
            state = 'fulfilled';
            _value = val;
            setTimeout(function() {
              stack.forEach(function(cb) {
                handle(cb)
              })
            })
        }
        
        if(typeof resolver === 'function'){
            resolver(resolve)
        }
    }
```

* 加入状态,resolve后改变状态位fulfilled
* resolve加入定时器延时处理
