<template>
  <div>
    <!-- 面包屑导航区域 -->
    <user-breadcrumb />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加用户区域区域 -->
      <user-search :queryInfo="queryInfo" @getUserList="getUserList" />
      <!-- 用户列表区域 -->
      <user-list :userList="userList" @getUserList="getUserList" />
      <!-- 分页区域 -->
      <user-pagination
        :queryInfo="queryInfo"
        :total="total"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import UserBreadcrumb from 'components/user/childrenCps/UserBreadcrumb'
import UserSearch from 'components/user/childrenCps/UserSearch'
import UserList from 'components/user/childrenCps/UserList'
import UserPagination from 'components/user/childrenCps/UserPagination'

export default {
  components: {
    UserBreadcrumb,
    UserSearch,
    UserList,
    UserPagination
  },
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 用户列表
      userList: [],
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 发送获取用户列表请求
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // 如果获取失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取成功后将数据存储在data中
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // 重新发送数据请求
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
