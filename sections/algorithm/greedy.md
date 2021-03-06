## 贪心算法

假设一个问题比较复杂，暂时找不到全局最优解

那么我们可以考虑把原问题拆成几个小问题

分别求每个小问题的最优解

再把这些“局部最优解”叠起来就“当作”整个问题的最优解

**特点就是每次只考虑局部最优解，而不考虑全局最优**

**只顾眼前,所以叫贪心**

### 背包问题

有一个背包，最多能承载150斤的重量

现在有7个物品，重量分别为[35, 30, 60, 50, 40, 10, 25]

它们的价值分别为[10, 40, 30, 50, 35, 40, 30]

应该如何选择才能使得我们的背包背走最多价值的物品

#### 思路

* 全局最优？
* 局部最优？

##### 每次拿最贵的

4 2 6 5

最终的总重量是：130

最终的总价值是：165

##### 每次拿最轻的

6 7 2 1 5

最终的总重量是：140

最终的总价值是：155

##### 拿 price / weight 比例最大的

6 2 7 4 1

最终的总重量是：150

最终的总价值是：170

**贪心只能贪到一定情况下的最优解**

比如拿第三个局部最优解来说

如果物品是不可分割的，按照第三种解法也不一定是全局最优的

#### 经典问题

1. 背包
2. 找零钱
3. 工人干活
