## 草稿状态

#### getNgAttribute、angularInit、bootstrap

```javascript
var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];
```

#### angularInit

```javascript

function angularInit(element, bootstrap) {
  var appElement,
      module,
      config = {};

  var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];

  // The element `element` has priority over any other element.

  // 遍历前缀 - 查找存在 app 入口的DOM元素
  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';

    if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
      // element
      appElement = element;
      // name of module
      module = element.getAttribute(name);
    }
  });

  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';
    var candidate;

    if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
      appElement = candidate;
      module = candidate.getAttribute(name);
    }
  });

  // 如果找到带 app 入口指令的元素 则自动启动Angular模块
  if (appElement) {
    if (!isAutoBootstrapAllowed) {
      window.console.error('AngularJS: disabling automatic bootstrap. <script> protocol indicates ' +
          'an extension, document.location.href does not match.');
      return;
    }
    // config strict DI
    config.strictDi = getNgAttribute(appElement, 'strict-di') !== null;
    bootstrap(appElement, module ? [module] : [], config);
  }
}
```

该方法的主要作用是遍历DOM,寻找是否存在带app入口指令的元素,如果存在,则直接调用bootstrap方法,启动angular模块


#### bootstrap