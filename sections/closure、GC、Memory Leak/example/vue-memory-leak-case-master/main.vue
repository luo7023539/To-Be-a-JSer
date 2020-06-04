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
		      }, 100)
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