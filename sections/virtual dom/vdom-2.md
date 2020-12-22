## Snabbdom

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

(这里的改指的是节点的位置顺序)

### 举例

