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