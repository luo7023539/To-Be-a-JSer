# Vue在IE Edge浏览器内存泄漏问题

### 问题描述

父子组件场景，子组件依赖父组件传入的数据，子组件销毁时IE Edge浏览器无法正常回收内存

``` html
<!--父组件定义了tableData和items数据（数组对象），通过属性方式传给子组件，两个子组件通过条件渲染指令控制展现-->
<template>
  <div>
    <div>
      <button type="button" @click="aa = true">xx</button>
      <button type="button" @click="aa = false">yy</button>
      <x :init="tab1Click" :tableData="tableData1" :items="items1" v-if="aa"></x>
      <y :init="tab2Click" :tableData="tableData2" :items="items2" v-else></y>
    </div>
  </div>
</template>
<script>
  import x from './component/x.vue'
  import y from './component/y.vue'
  export default {
    data () {
      return {
        aa: true,
        tableData1: [],
        tableData2: [],
        items1: [],
        items2: []
      }
    },
    methods: {
      tab1Click () {
        this.tableData1 = []
        this.items1 = []
        setTimeout(() => {
          this.tableData1 = [
            {key: 'x1', a:'a', b:2, c:3, d:4, e: 5},
	          {key: 'x2', a:'a', b:2, c:3, d:4, e: 5},
            {key: 'x3', a:'a', b:2, c:3, d:4, e: 5},
            {key: 'x4', a:'a', b:2, c:3, d:4, e: 5},
            {key: 'x5', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x6', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x7', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x8', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x9', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x10', a:'a', b:2, c:3, d:4, e: 5}
		      ]
		      this.items1 = [
		        {title: 'a', prop: 'a'},
		        {title: 'b', prop: 'b'},
		        {title: 'c', prop: 'c'},
		        {title: 'd', prop: 'd'},
		        {title: 'e', prop: 'e'}
		      ]
		    }, 1000)
			},
			tab2Click () {
			  this.tableData2 = []
			  this.items2 = []
			  setTimeout(() => {
				  this.tableData2 = [
		        {key: 'x1', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x2', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x3', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x4', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x5', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x6', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x7', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x8', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x9', a:'a', b:2, c:3, d:4, e: 5},
		        {key: 'x10', a:'a', b:2, c:3, d:4, e: 5}
		      ]
		      this.items2 = [
		        {title: 'a', prop: 'a'},
		        {title: 'b', prop: 'b'},
		        {title: 'c', prop: 'c'},
		        {title: 'd', prop: 'd'},
		        {title: 'e', prop: 'e'}
		      ]
		    }, 100)
			}
		},
	  components: {
	    x,
	    y
	  }
	}
</script>
```
``` html
<!--子组件x通过父组件传入的方法改变初始化数据-->
<template>
<div>
  xx
  <table>
    <tr v-for="row in tableData" :key="row.key">
      <td v-for="item in items" :key="item.prop"> 
        <div v-for="i in 100">
          <input type="text" :value="row[item.prop]" />
        </div>
      </td>
    </tr>
  </table>
</div>
</template>
<script>
  export default {
    props: ['tableData', 'items', 'init'],
    mounted () {
      this.init()
    }
  }
</script>
```
### 问题重现步骤

下载当前demo，并运行 `npm install` 安装，完成后运行 `npm start` 启动工程，通过浏览器输入 http://localhost:8080/ 访问问题页面，交叉重复点击 **xx** 和 **yy** 按钮，看到任务管理器中ie浏览器占用内存不断飙升。

### 初步分析结论

该问题在ie edge浏览器下可以重现，chrome下是正常的
怀疑是条件渲染切换不同子组件展示时，每次切换会导致当前子组件被销毁，但是对应传入的prop并未销毁，组件的DOM与prop对象存在引用联系，尽管组件已销毁，但是引用关系仍然存在内存中，导致内存x泄漏。
