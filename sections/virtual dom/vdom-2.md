## Snabbdom

### h
### Patch

主要有以下流程
![vnode_process](/assets/vnode_process.png)

里面有几个关键点

1. `sameVnode`

```javascript
function sameVnode (vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}
```

2. 深度优先

```javascript
if (isDef(oldCh) && isDef(ch)) {
  // FIXME: - 2
  // 深度优先
  if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
} else if (isDef(ch)) {
  // 根节点
  if (isDef(oldVnode.text)) api.setTextContent(elm, '')
  addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
} else if (isDef(oldCh)) {
  removeVnodes(elm, oldCh, 0, oldCh.length - 1)
} else if (isDef(oldVnode.text)) {
  api.setTextContent(elm, '')
}
```

3. 同级列表对比

```javascript
function updateChildren(parentElm: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVnodeQueue: VNodeQueue) {
    // FIXME: - 3 列表同级对比
```

### Diff

回顾一下`sameVnode`

```javascript
function sameVnode (vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}
```

真正决定最大程度复用节点的其实是`sel`,包括`tagName`,`className`,`id`,`key`更多是可选项

接下来要解决的问题就是节点的**增**/**删**/**改**

### updateChildren

先讨论最为复杂的情况
两个子节点列表更新

```javascript
let oldStartIdx = 0
let newStartIdx = 0
let oldEndIdx = oldCh.length - 1
let oldStartVnode = oldCh[0]
let oldEndVnode = oldCh[oldEndIdx]
let newEndIdx = newCh.length - 1
let newStartVnode = newCh[0]
let newEndVnode = newCh[newEndIdx]
let oldKeyToIdx: KeyToIndexMap | undefined
let idxInOld: number
let elmToMove: VNode
let before: any

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
```
双指针内移的循环
两两组合一共有4种组合

##### 无需移动 - 同侧节点相等
1. `oldStartVnode` = `newStartVnode`
2. `oldEndVnode` = `newEndVnode`

```javascript
else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    }
```

##### 需要移动 - 不同侧节点相等
1. `oldStartVnode` = `newEndVnode`
2. `oldEndVnode` = `newStartVnode`

有部分要点:

* 索引代表当前处理到哪里
* 前移放左侧,后移放右侧

##### 组合均不满足

缓存
```javascript
function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number): KeyToIndexMap {
  const map: KeyToIndexMap = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (key !== undefined) {
      map[key] = i
    }
  }
  return map
}
```

1. 不存在 - 新建
2. 二次判断`sel` - 新建
3. 存在且`sel` - 移位

```javascript
newStartVnode = newCh[++newStartIdx]
```

左侧索引移位,则插入位置类似前移

##### 跳出循环

把剩下的全都删除或新增

#### 非均均存在子节点

```javascript
if (isUndef(vnode.text)) {
  if (isDef(oldCh) && isDef(ch)) {
    if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
  } else if (isDef(ch)) {
    // 根节点
    if (isDef(oldVnode.text)) api.setTextContent(elm, '')
    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
  } else if (isDef(oldCh)) {
    removeVnodes(elm, oldCh, 0, oldCh.length - 1)
  } else if (isDef(oldVnode.text)) {
    api.setTextContent(elm, '')
  }
} else if (oldVnode.text !== vnode.text) {
  if (isDef(oldCh)) {
    removeVnodes(elm, oldCh, 0, oldCh.length - 1)
  }
  api.setTextContent(elm, vnode.text!)
}
```

到此节点DOM结构已经处理完毕

回到最开始的`DEMO`

```javascript
import { init } from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import { h } from 'snabbdom/h' // helper function for creating vnodes

var patch = init([ // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
])
```

init接口各个模块的钩子函数

其他属性的更新均通过钩子完成