## Vue - vdom

接下来回到`Vue`

我们知道`virtual dom`提供了两个api

即是`h`,`init`

#### `h`
`h`是对创建`vnode`的封装,在vue当中她是render的参数

在手写`render`的时候会发现有这两种参数命名
```javascript
const vm = new Vue({
    render (h) {
      const children = [
        this.ok ? h('div', 'toggler ') : null,
        h('div', [this.$slots.default, h('span', ' 1')]),
        h('div', [h('label', ' 2')])
      ]
      return h('div', children)
    },
    render: function (createElement) {
      return createElement('div', {
        attrs: {
            id: 'app'
          },
      }, this.message)
    }
  }
}).$mount()
```

#### `init`

用来创建`patch`函数

位于`platforms\web\runtime\patch.js`
```javascript
/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

位于`platforms\web\runtime\index.js`
```javascript
import { patch } from './patch'

// ...

Vue.prototype.__patch__ = inBrowser ? patch : noop
```
