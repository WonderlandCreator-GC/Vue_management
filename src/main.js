import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式表
import 'assets/css/global.css'
// 引入字体图标
import 'assets/fonts/iconfont.css'

// 引入配置网络模块
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 拦截请求，为除登录外的其他请求的请求头挂载token令牌
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
Vue.prototype.$http = axios

// 全局注册树形表格组件
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
