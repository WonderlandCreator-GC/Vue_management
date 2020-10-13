import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ 'components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ 'components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ 'components/Welcome')
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/rights/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/rights/Roles')
const Category = () => import(/* webpackChunkName: "Cate_Params" */ 'components/goods/Category')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ 'components/goods/Params')
const List = () => import(/* webpackChunkName: "GoodsList_Add" */ 'components/goods/List')
const AddGoods = () => import(/* webpackChunkName: "GoodsList_Add" */ 'components/goods/AddGoods')
const Order = () => import(/* webpackChunkName: "Order_Report" */ 'components/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ 'components/report/Report')

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
