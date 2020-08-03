<template>
  <div>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    queryInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    total: Number
  },
  methods: {
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.$emit('handleSizeChange', newSize)
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.$emit('handleCurrentChange', newPage)
    }
  }
}

</script>
<style>
</style>
