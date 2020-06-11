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