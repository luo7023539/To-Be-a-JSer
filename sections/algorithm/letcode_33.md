## 搜索旋转排序数组

假设按照升序排序的数组在预先未知的某个点上进行了旋转。

( 例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] )。

搜索一个给定的目标值，如果数组中存在这个目标值，则返回它的索引，否则返回 -1 。

你可以假设数组中不存在重复的元素。

你的算法时间复杂度必须是`O(log n)`级别。

**示例 1:**

```
输入: nums = [4,5,6,7,0,1,2], target = 0
输出: 4
```

**示例 2:**

```
输入: nums = [4,5,6,7,0,1,2], target = 3
输出: -1
```

### 数据结构

线性、升序、某节点反转

* 遍历、二分、分块
* 具备一定顺序是前提条件
* 反转点两端均有序、随机多次取则至少一端有序

    * 左有序、右无序
    * 左无序、右有序
    * 左右皆有序

### 转化为代码

限制复杂度、选择二分

#### One

较优解

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    var startIdx = 0;
    var endIdx = nums.length - 1;

    // POINT
    // 最终二分可能存在最后为一个元素的情况
    // 需要考虑 =
    // 或者
    // 增加边界判断
    while (endIdx >= startIdx) {
        var midIdx = startIdx + (endIdx - startIdx >> 1);
        var mid = nums[midIdx];
        var start = nums[startIdx];
        var end = nums[endIdx];
        if (target === mid) {
            return midIdx
        // 左边有序
        }else if (start < mid) {
            // 左边？
            if (target >= start && target < mid)
                endIdx = midIdx - 1
            else
                // 右边？
                startIdx = midIdx + 1
        }else {
            // 右边有序
            if (target <= end && target > mid)
                startIdx = midIdx + 1
            else
                end = midIdx - 1
        }
    }

    return -1
};
```

#### Two

先寻找反转点（最小值）

然后对两边再次进行二分

最差的情况就是反转点为首项，且查询值为次项，

`[2,3,4,5,6,7,1]`

整体复杂度为`O(2log2 n)`