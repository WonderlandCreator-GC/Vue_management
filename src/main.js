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

// 自定义格式化时间的全局过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
