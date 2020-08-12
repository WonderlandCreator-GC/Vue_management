import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/Login')
const Home = () => import('components/Home')
const Welcome = () => import('components/Welcome')
const Users = () => import('components/user/Users')
const Rights = () => import('components/rights/Rights')
const Roles = () => import('components/rights/Roles')
const Category = () => import('components/goods/Category')
const Params = () => import('components/goods/Params')
const List = () => import('components/goods/List')
const AddGoods = () => import('components/goods/AddGoods')
const Order = () => import('components/order/Order')
const Report = () => import('components/report/Report')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Category },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路由, from 代表从哪个路由跳转而来
  // next 是一个函数，表示放行: 方式一：next()-直接放行  方式二：next('/login')  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
