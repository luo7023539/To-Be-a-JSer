## 双数相加 II

给你两个 非空 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。

你可以假设除了数字 0 之外，这两个数字都不会以零开头。

**进阶：**

如果输入链表不能修改该如何处理？换句话说，你不能对列表中的节点进行翻转。

**示例：**

```
输入：(7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 8 -> 0 -> 7
```

### 思路

数字相加均为低位相加

而当前为高位位于链表头

需要把读数的顺序倒转过来

问题就变成如何反转单链表

常用的栈或者直接遍历单链表

接下来就需要处理数字相加的问题

#### 转为代码

```javascript
var addTwoNumbers = function(l1, l2) {
    var s1 = []; 
    var s2 = []; 

    var c1 = l1;
    var c2 = l2;

    while(c1) {
        s1.push(c1.val);
        c1 = c1.next;
    }

    while(c2) {
        s2.push(c2.val);
        c2 = c2.next;
    }

    var n1, n2, curry = 0,sr = [];

    while (s1.length || s2.length) {
        n1 = s1.pop() || 0;
        n2 = s2.pop() || 0;

        var t = n1 + n2 + curry;
        sr.push(t % 10);

        curry = Number(t >= 10)
    }

    if (curry) 
        sr.push(1)
        // sr再进行一次反转成单链表
        //console.log(sr)
    
    var dummy = {};

    var cn = dummy;

    while(sr.length) {
        cn.next = {
            val: sr.pop(),
            next: null
        }

        cn = cn.next;
    }

    return dummy.next
};
```

#### 反转单链表

把当前链表的下一个节点插入到头结点dummy的下一个节点中，就地反转

```
dummy->1->2->3->4->5

dummy->2->1->3->4->5
dummy->3->2->1->4->5
dummy->4>-3->2->1->5
dummy->5->4->3->2->1
```