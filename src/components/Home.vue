<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/image/logo.png" alt="" />
        <span>商城后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 展开与收起侧边栏按钮 -->
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>
         <!-- 路由占位符 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 图标对象（储存一级菜单图标）
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 侧边栏是否折叠
      isCollapse: false,
      // 激活的链接地址
      activePath: ''
    }
  },
  created() {
    // 获取所有菜单
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清除token
      window.sessionStorage.clear()
      // 重定向会登录页面
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // 如果获取失败
      if (res.meta.status !== 200) return this.$message.error(res.mata.msg)
      // 获取成功，将数据存到menuList
      this.menuList = res.data
    },
    // 展开与折叠侧边栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  background-color: #373d41;
  font-size: 18px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 48px;
    }
    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  transition: all 0.2s;
  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color:#eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle_button {
  height: 24px;
  background-color: #4a5064;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: .2em;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
</style>
