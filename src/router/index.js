import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/Login')
const Home = () =>import('components/Home')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路由, from 代表从哪个路由跳转而来
  // next 是一个函数，表示放行: 方式一：next()-直接放行  方式二：next('/login')  强制跳转
  if(to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
