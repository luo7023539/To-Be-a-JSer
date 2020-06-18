## II. 平衡二叉树

输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过1，那么它就是一棵平衡二叉树。

示例 1:

给定二叉树 [3,9,20,null,null,15,7]
```
    3
   / \
  9  20
    /  \
   15   7
返回 true 。
```
示例 2:

给定二叉树 [1,2,2,3,3,null,null,4,4]

```
       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
//  false
```

限制：

1 <= 树的结点个数 <= 10000

[letcode-110](https://leetcode-cn.com/problems/balanced-binary-tree/)


### 思路

（生成AVL，是否需要旋转的方法）

1. 树的深度
2. 逐层左右节点对比

```javascript

const isB = function (root) {
    if (!root) {
        return true;
    }

    let leftHeight = maxDepth(root.left);
    let rightHeight = maxDepth(root.right);
    if (Math.abs(leftHeight - rightHeight) > 1) {
        return false;
    }
    return isB(root.left) && isB(root.right);
};

const maxDepth = function (root) {
    if (!root)
        return null
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}

```

## 复杂度计算

当前时间复杂度 - `nlogn`

假设 N个 节点二叉树

其中各层为 `2, 4, 8, 16, 2^(h-1)`

该为等比数列

故 1 - 2^h / 1 - 2 = 2^h -1 = N

所以 h = log2(N + 1)

树的高度复杂度为 logN

各层求取得次数为最大为第一次N次，最小为最末层 N + 1 / 2

共计时间复杂度为 `（N - (N + 1) / 2 )` * `logN`

忽略常数项即为 `NlogN`