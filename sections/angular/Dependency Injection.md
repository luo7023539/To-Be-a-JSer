## 草稿

## Angular 依赖注入

### 简化版本
```javascript
function extractArgs(fn) {
    var args = fn.toString().match(/^[^\(]*\(\s*([^\)]*)\)/m);
    return args[1].split(',');
}

function createInjector(cache) {
    this.cache = cache;
}
angular.module = function () {
    modules = {};
    injector = new createInjector(modules);
    return {
        injector: injector,
        factory: function (name, fn) {
                    modules[name.trim()] = this.injector.invoke(fn);
                    return this;
        }
    }
};

createInjector.prototype = {
        invoke: function (fn, self) {
            argsString = extractArgs(fn);
            // 获取形参
            args = [];
            // 获取实参
            argsString.forEach(function (val) {
                args.push(this.cache[val.trim()]);
            }, this);
            // 注入实参、实行函数
            return fn.apply(self, args);
        }
    };
```

* extractArgs方法采用正则匹配,获取形参
* module方法用来创建模块,创建模块时实例化注射器
* invoke方法注入实参

