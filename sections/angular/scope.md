## Angular Scope 源码

Angular中作用域（Scope）用来连接控制器及视图

作用纽带,它主要实现以下功能:

1. 作用域层级关系
2. 脏值检查机制
3. 触发脏值检查
4. 基于作用域的事件系统

### 作用域层级关系

$rootScope 作用根作用域在模块创建后被创建

```javascript
    function Scope() {
          this.$id = nextUid();
          // 生成唯一id
          this.$$phase = this.$parent = this.$$watchers =
                         this.$$nextSibling = this.$$prevSibling =
                         this.$$childHead = this.$$childTail = null;
          // 初始化脏检标志、作用域层级关系、观察者队列
          this.$root = this;
          // 挂载根作用域
          this.$$destroyed = false;
          // 销毁标志
          this.$$listeners = {};
          // 事件系统
          this.$$listenerCount = {};
          // 事件监听数量
          this.$$watchersCount = 0;
          // 脏检数量
          this.$$isolateBindings = null;
    }

    var $rootScope = new Scope();

    return $rootScope;
```

当Angular解析至控制器或某些指令,将调用当前Scope的$new方法创建作用域

```javascript
$new: function (isolate, parent) {
        var child;

        parent = parent || this;
        
        if (isolate) {
            // 是否生成隔离作用域
          child = new Scope();
          child.$root = this.$root;
        } else {
          if (!this.$$ChildScope) {
              // 通过传入的this产生构造函数
            this.$$ChildScope = createChildScopeClass(this);
          }
          child = new this.$$ChildScope();
        }
        
        // 处理父子兄弟关系!
        child.$parent = parent;
        child.$$prevSibling = parent.$$childTail;
        if (parent.$$childHead) {
          parent.$$childTail.$$nextSibling = child;
          parent.$$childTail = child;
        } else {
          parent.$$childHead = parent.$$childTail = child;
        }
        
        if (isolate || parent !== this) child.$on('$destroy', destroyChildScope);

        return child;
      }
```

创建构造函数的方法
```javascript
    function createChildScopeClass(parent) {
      function ChildScope() {
        // $$watchers
        this.$$watchers = this.$$nextSibling =
            this.$$childHead = this.$$childTail = null;
        this.$$listeners = {};
        this.$$listenerCount = {};
        this.$$watchersCount = 0;
        this.$id = nextUid();
        this.$$ChildScope = null;
      }
      ChildScope.prototype = parent;
      return ChildScope;
    }
```

#### 要点

1. scope其实就是一个普通的对象,且借用原型继承的进行属性继承
2. 每个scope上都维护了自己的父子即兄弟关系,脏检及事件查找

### 脏值检查机制

```javascript
$watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
    // 得到获取属性的方法
        var get = $parse(watchExp);

        if (get.$$watchDelegate) {
          return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
        }
        var scope = this,
            array = scope.$$watchers,
            
            // 每个观察者其实是一个对象,保存回调函数、旧值、get方法、表达式、是否比较对象
            watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: prettyPrintExpression || watchExp,
              eq: !!objectEquality
            };

        lastDirtyWatch = null;

        if (!isFunction(listener)) {
          watcher.fn = noop;
        }

        if (!array) {
          array = scope.$$watchers = [];
          array.$$digestWatchIndex = -1;
        }
        // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);
        array.$$digestWatchIndex++;
        incrementWatchersCount(this, 1);

        // 返回函数用于解除对该值的监控
        return function deregisterWatch() {
          var index = arrayRemove(array, watcher);
          if (index >= 0) {
            incrementWatchersCount(scope, -1);
            if (index < array.$$digestWatchIndex) {
              array.$$digestWatchIndex--;
            }
          }
          lastDirtyWatch = null;
        };
      }
```

$watch实际是在该scope的$$watch属性上创建一个观察者数组,并返回一个函数用于解除监控

```javascript
$digest: function() {
        var watch, value, last, fn, get,
            watchers,
            dirty, ttl = TTL,
            next, current, target = this,
            watchLog = [],
            logIdx, asyncTask;
        beginPhase('$digest');
        
        lastDirtyWatch = null;

        // 外层循环
        do { // "while dirty" loop
          dirty = false;
          current = target;
          
          traverseScopesLoop:
          do { // "traverse the scopes" loop
            if ((watchers = current.$$watchers)) {
              watchers.$$digestWatchIndex = watchers.length;
              while (watchers.$$digestWatchIndex--) {
                try {
                  watch = watchers[watchers.$$digestWatchIndex];
                  if (watch) {
                    get = watch.get;
                    if ((value = get(current)) !== (last = watch.last) &&
                        !(watch.eq
                            ? equals(value, last)
                            : (isNumberNaN(value) && isNumberNaN(last)))) {
                      dirty = true;
                      lastDirtyWatch = watch;
                      watch.last = watch.eq ? copy(value, null) : value;
                      fn = watch.fn;
                      fn(value, ((last === initWatchVal) ? value : last), current);
                      if (ttl < 5) {
                        logIdx = 4 - ttl;
                        if (!watchLog[logIdx]) watchLog[logIdx] = [];
                        watchLog[logIdx].push({
                          msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                          newVal: value,
                          oldVal: last
                        });
                      }
                    } else if (watch === lastDirtyWatch) {
                      dirty = false;
                      break traverseScopesLoop;
                    }
                  }
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            }

            // Insanity Warning: scope depth-first traversal
            // yes, this code is a bit crazy, but it works and we have tests to prove it!
            // this piece should be kept in sync with the traversal in $broadcast
            if (!(next = (

            // 当前作用域存在观察者 且 存在子作用域将大儿子赋值给next
            // 当前作用域存在观察者,则需要迭代子作用域,查看是否因为父作用域值变化影响到子作用域
              (current.$$watchersCount && current.$$childHead) ||
              // 当前遍历子作用域 且子作用域存在弟弟作用域
              (current !== target && current.$$nextSibling)
                )
              )
            ) {
              while (current !== target && !(next = current.$$nextSibling)) {
                current = current.$parent;
              }
            }
          } while ((current = next));

          // `break traverseScopesLoop;` takes us to here

          if ((dirty || asyncQueue.length) && !(ttl--)) {
            clearPhase();
            throw $rootScopeMinErr('infdig',
                '{0} $digest() iterations reached. Aborting!\n' +
                'Watchers fired in the last 5 iterations: {1}',
                TTL, watchLog);
          }

        } while (dirty);

        clearPhase();
      }
```

以上代码去除了部分注释、代码, 保留内外循环;

#### 要点

1. 外层循环的作用主要是通过不断执行内循环来保证没有脏值出现
2. 内循环通过不断遍历该scope及所有子作用域的$$watch队列来保证不存在脏值
3. 类似于二叉树的遍历,更深层的作用域优先被遍历到

### 触发脏值检查
```javascript
$eval: function(expr, locals) {
        return $parse(expr)(this, locals);
     }
```

调用$parse,使我们能够在scope的context中执行一段表达式

```javascript
$apply: function(expr) {
        try {
          // beginPhase
          beginPhase('$apply');
          try {
            //
            return this.$eval(expr);
          } finally {
            clearPhase();
          }
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          try {
            $rootScope.$digest();
          } catch (e) {
            $exceptionHandler(e);
            // eslint-disable-next-line no-unsafe-finally
            throw e;
          }
        }
    }
```

#### 要点
1. $apply本质上，就是用$eval执行了一段表达式，再调用rootScope的$digest方法。

2. 当不需要从根作用域开始进行$digest循环时, 可使用该作用域$digest方法来代替$apply。

```javascript
$evalAsync: function(expr, locals) {
        // if we are outside of an $digest loop and this is the first time we are scheduling async
        // task also schedule async auto-flush

        if (!$rootScope.$$phase && !asyncQueue.length) {
          $browser.defer(function() {
            if (asyncQueue.length) {
              $rootScope.$digest();
            }
          });
        }

        asyncQueue.push({scope: this, fn: $parse(expr), locals: locals});
      }
```

$evalAsync的代码会在正在运行的$digest循环中被执行，如果当前没有正在运行的$digest循环，会自己延迟触发一个$digest循环来执行延迟代码。

```javascript
$applyAsync: function(expr) {
        var scope = this;
        if (expr) {
          applyAsyncQueue.push($applyAsyncExpression);
        }
        expr = $parse(expr);
        scheduleApplyAsync();

        function $applyAsyncExpression() {
          scope.$eval(expr);
        }
      }
```
$applyAsync用于合并短时间内多次$digest循环，优化应用性能。

在日常开发工作中，常常会遇到要短时间内接收若干http响应，同时触发多次$digest循环的情况。使用$applyAsync可合并若干次$digest，优化性能。

```javascript
$destroy: function() {
        // We can't destroy a scope that has been already destroyed.
        if (this.$$destroyed) return;
        var parent = this.$parent;

        this.$broadcast('$destroy');
        this.$$destroyed = true;

        if (this === $rootScope) {
          //Remove handlers attached to window when $rootScope is removed
          $browser.$$applicationDestroyed();
        }

        incrementWatchersCount(this, -this.$$watchersCount);
        for (var eventName in this.$$listenerCount) {
          decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
        }

        // sever all the references to parent scopes (after this cleanup, the current scope should
        // not be retained by any of our references and should be eligible for garbage collection)
        if (parent && parent.$$childHead === this) parent.$$childHead = this.$$nextSibling;
        if (parent && parent.$$childTail === this) parent.$$childTail = this.$$prevSibling;
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;

        // Disable listeners, watchers and apply/digest methods
        this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
        this.$on = this.$watch = this.$watchGroup = function() { return noop; };
        this.$$listeners = {};

        // Disconnect the next sibling to prevent `cleanUpScope` destroying those too
        this.$$nextSibling = null;
        cleanUpScope(this);
      }
```

当该作用域销毁时触发,将连带清除该作用域的所有引用关系

### 基于作用域的事件系统

```javascript
      $on: function(name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        var current = this;
        do {
          if (!current.$$listenerCount[name]) {
            current.$$listenerCount[name] = 0;
          }
          current.$$listenerCount[name]++;
        } while ((current = current.$parent));

        var self = this;
        return function() {
          var indexOfListener = namedListeners.indexOf(listener);
          if (indexOfListener !== -1) {
            namedListeners[indexOfListener] = null;
            decrementListenerCount(self, 1, name);
          }
        };
      },

      $emit: function(name, args) {
        var empty = [],
            namedListeners,
            scope = this,
            stopPropagation = false,
            event = {
              name: name,
              targetScope: scope,
              stopPropagation: function() {stopPropagation = true;},
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            i, length;

        do {
          namedListeners = scope.$$listeners[name] || empty;
          event.currentScope = scope;
          for (i = 0, length = namedListeners.length; i < length; i++) {

            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              //allow all listeners attached to the current scope to run
              namedListeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          //if any listener on the current scope stops propagation, prevent bubbling
          if (stopPropagation) {
            event.currentScope = null;
            return event;
          }
          //traverse upwards
          scope = scope.$parent;
        } while (scope);

        event.currentScope = null;

        return event;
      },

      $broadcast: function(name, args) {
        var target = this,
            current = target,
            next = target,
            event = {
              name: name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            };

        if (!target.$$listenerCount[name]) return event;

        var listenerArgs = concat([event], arguments, 1),
            listeners, i, length;

        //down while you can, then up and next sibling or up and next sibling until back at root
        while ((current = next)) {
          event.currentScope = current;
          listeners = current.$$listeners[name] || [];
          for (i = 0, length = listeners.length; i < length; i++) {
            // if listeners were deregistered, defragment the array
            if (!listeners[i]) {
              listeners.splice(i, 1);
              i--;
              length--;
              continue;
            }

            try {
              listeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          // (though it differs due to having the extra check for $$listenerCount)
          if (!(next = ((current.$$listenerCount[name] && current.$$childHead) ||
              (current !== target && current.$$nextSibling)))) {

            while (current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        }
        event.currentScope = null;
        return event;
      }

```

#### 要点
1. 通过作用域上面父子关系实现事件系统
2. $on方法类似$watch方法,维护每个事件队列,并返回销毁函数
2. 发射事件仅通知该作用域的直系作用域
3. 下发事件更类似于脏检查的作用域遍历顺序

### 忽略了不少细节后续补充!!!


