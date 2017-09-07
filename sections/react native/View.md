## View 

#### 作为布置UI最基础的组件

* 支持Flexbox布局、样式
* 可放置于其他视图,可也多重嵌套
* 针对不同平台对应不同原生视图UIView、div、android.view.View


#### Property

* onLayout 

```
onLayout function 

当组件挂载或者布局变化的时候调用，参数为：

{nativeEvent: { layout: {x, y, width, height}}}

这个事件会在布局计算完成后立即调用一次，不过收到此事件时新的布局可能还没有在屏幕上呈现，尤其是一个布局动画正在进行中的时候。
```

#### StyleSheet

* Flexbox
* ShadowProp#style...
* Transforms...
* background系列
* border系列