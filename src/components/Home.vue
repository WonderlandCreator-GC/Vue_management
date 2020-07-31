<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // 清除token
      window.sessionStorage.clear()
      // 重定向会登录页面
      this.$router.push('/login')
    }
  }
}
</script>
<style></style>
