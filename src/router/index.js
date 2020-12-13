import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'
import {visitApi} from "@/api/Modules";
import settings from '@/settings'

Vue.use(VueRouter)

const routes = [
  {
    name: 'layout',
    path: '/',
    redirect: '/home',
    component: () => import('@/layout'),
    children: [
      {name: 'home', path: '/home', meta: {title: '首页'}, component: () => import('@/views/home/index')},
      {name: 'home2', path: '/home2', meta: {title: '首页2'}, component: () => import('@/views/home/index')},
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index')
  },
]


const router = new VueRouter({
  mode: settings.isHistory ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.name !== from.name) {
      return {x: 0, y: 0}
    } else if (to.hash) {
      return {
        selector: to.hash,
        offset: {x: 0, y: 0}
      }
    }
  }
})

const needLogin = [] // 拦截对象

// 路由守卫：
router.beforeEach((to, from, next) => {
  // 检测token是否存在（是否登录）
  visitApi()
  if (to.meta.title) document.title = to.meta.title
  if (store.getters.token && store.getters.token !== '') {
    next()
  } else {
    if (needLogin.indexOf(to.path) === -1) {
      next()
    } else {
      next('/login?redirect=' + to.path)
    }
  }
})

export default router
