## Promise 

基于Promise/A+（即ES6的Promise的实现）

链式Promise就是把resolve玩出花了!!

### 补充

异步实现与原生存在差异
采用`setTimeout`实现的异步延时将将其加入到Event loop
而浏览器实现则加入macrotask
故存在先后差异！
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
          reject({
              err: 0,
              msg: 'task2'
          })
        })
      })    
    }
    
    _task1()
        .then(function(data) {
          console.log('task1', data)
          return _task2()
        })
        // bridge
        .then(function(data) {
          console.log('success', data)
        }, function(data) {
          console.log('error', data)
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

#### 链式Promise

* 采用return this的做法操作的均为同一个Promise
    
    故需要在then中返回另一个Promise,以实现链式Promise
    
    即在上一个Promise成功回调后,调用返回的Promise的resolve方法
    

```javascript
    function Promise(resolver) {
        var stack = [],
            state = 'pending',
            _value = null;
        this.then = function(onFulfilled) {
           // 把回调推入stack中
           return new Promise(function(resolve) {
               handle({
                   onFulfilled: onFulfilled,
                   resolve: resolve
               })
               // 将新创建的Promise的resolve及调用then方法传入的成功回调均推入队列中
           })
           // 方便链式调用
        }
        
        function handle(cb) {
          if(state === 'pending'){
              return stack.push(cb)
          }
          
          // 不仅需要执行上一个Promise的成功回调,还得将返回的Promise状态置为onFulfilled
          var ret = cb.onFulfilled(_value);
              cb.resolve(ret);
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

用该实例解释一下流程:

* `_task1`返回一个`Promise_task1`
* 第一个then方法给`Promise_task1`指定回调,并返回`Promise_bridge`
* 第二个then方法给`Promise_bridge`指定回调,推入其stack中
* 当`Promise_task1`的`resolve`被调用
* 遍历自己的stack,执行`Promise_task1`的成功回调,并且调用`Promise_bridge`的resolve
* 遍历`Promise_bridge`遍历自己的stack,执行回调
* 故一路成功调用下去

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
          console.log('success', data)
          return {msg: 'task2'}
        })
        .then(function(data) {
          console.log('success', data)
        })
```


还有一个问题:

* 当回调用手动返回Promise的时候,后续then方法应该响应手动返回的成功及失败
* resolve方法需要根据回调的返回值做不同的处理
    1. 返回非Promise,认为`Promise_bridge`成功
    2. 返回Promise,使用该Promise给`Promise_bridge`指定成功及失败
    
* 代码实现为,当返回Promise时,将`Promise_bridge`的resolve作为其回调

```javascript
    function resolve(val) {
        if(val instanceof Promise){
            return val.then.call(val, resolve)   
        }
        state = 'fulfilled';
        _value = val;
        setTimeout(function() {
          stack.forEach(function(cb) {
            handle(cb)
          })
        })
    }
```

即当手动返回的Promise成功,调用其onFulfilled即`Promise_bridge`的resolve方法

#### 失败处理

* 增加状态判断
* 针对`Promise_bridge`除非手动返回,否则均为resolve
* 增加reject函数,改变state为`rejected`

```javascript
function Promise(resolver) {
        var stack = [],
            state = 'pending',
            _value = null;
        this.then = function(onFulfilled, onRejected) {
           // 把回调推入stack中
           return new Promise(function(resolve, reject) {
               handle({
                   onFulfilled: onFulfilled,
                   resolve: resolve,
                   onRejected: onRejected,
                   reject: reject
               })
               // 将新创建的Promise的resolve及调用then方法传入的成功回调均推入队列中
           })
           // 方便链式调用
        }
        
        function handle(cb) {
          if(state === 'pending'){
              return stack.push(cb)
          }
          
          // 不仅需要执行上一个Promise的成功回调,还得将返回的Promise状态置为onFulfilled
          var nameString = state === 'fulfilled' ? 'onFulfilled' : 'onRejected';
          var ret = cb[nameString](_value);
          // Promise_bridge
              cb.resolve(ret);
        }
        
        function resolve(val) {
            if(val instanceof Promise){
                return val.then.call(val, resolve, reject)   
            }
            state = 'fulfilled';
            _value = val;
            execute()
        }
        
        function reject(val) {
          state = 'rejected';
          _value = val;
          execute()
        }
        
        function execute() {
            setTimeout(function() {
              stack.forEach(function(cb) {
                handle(cb)
              })
            })
        }
        
        if(typeof resolver === 'function'){
            resolver(resolve, reject)
        }
    }
```

#### 错误处理

增加try、catch捕获错误

```javascript
    function handle(cb) {
      if(state === 'pending'){
          return stack.push(cb)
      }
      
      // 不仅需要执行上一个Promise的成功回调,还得将返回的Promise状态置为onFulfilled
      var nameString = state === 'fulfilled' ? 'onFulfilled' : 'onRejected';
      try{
          var ret = cb[nameString](_value);
          cb.resolve(ret);
      }catch (e){
          cb.reject(e)
      }
    }
```

总体来说:

* 提前创建`Promise_bridge`用以连接Promise流程,并注册回调,待结果返回后遍历流程!

### Refs

(Promise/A+)[http://www.ituring.com.cn/article/66566]