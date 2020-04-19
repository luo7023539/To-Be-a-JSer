## 快速排序

最近看到网上文章提到快速排序
给的实例感觉是生面孔啊

自己照着思路写了一下
确实跟往常不大一样了

### 说一下看到的

主要有两种理解方式
一种是挖坑填坑

从右扫小，填左，从左扫大，填右，出循环交换基数跟出循环的位置
这样一次循环便将基数归位
代码实现就是注释的那种

另一种理解是一次性找一对，互换，然后到处循环交换基数跟出循环的位置

双指针的循环在snabbdom里面的diff也看到过
现在再看到还是挺熟悉的
```javascript
function quickSort(array, left, right) {
    if (left === undefined && right === undefined) {
        left = 0;
        right = array.length - 1
    }

    if (left > right) {
        return
    }

    let i, j, temp;
    temp = array[left];
    i = left;
    j = right;
    while (i !== j) {

        while (array[j] >= temp && i < j)
            j--;
        // array[i++] = array[j]
        while (array[i] <= temp && i < j)
            i++;
        // array[j--] = array[i]
        if (i < j) {
            [array[i], array[j]] = [array[j], array[i]]
        }
    }

    [array[left], array[i]] = [array[i], array[left]]
    quickSort(array, left, i - 1);
    quickSort(array, i + 1, right)
}
```

#### 补充一下

##### 打哑迷的从右开始

其实从左扫跟从右扫最根本的区别就在临近退出循环的那一刻
你必须要保证最终跟基数交换的位置是比他小或者等于的数字
那么必须是左指针跟基数交换而不是右指针
```javascript
// 原始
2 3 1 5 6 4
// 大家可以尝试一下

// 右扫
  i j
2 1 3 5 6 4
// 这时候j--
// 2 1 互换

// 左扫
  i j
2 1 3 5 6 4
// 这时候i++
// 2 3 互换
```

##### 缺陷

另一个要说的就是。。重复项的问题
略尴尬

刚好做测试的时候用的`Math.random() * 10`,导致随机数据大量的重复数字，确实不准确
具体解决方式明天跟踪
### 印象中的

印象中的实现是创建两个数组左右推，最后拼接