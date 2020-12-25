import Vue from 'vue'
import VueRouter from 'vue-router'
import settings from '@/settings'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index')
  },
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {name: 'Home', path: '/home', meta: {title: '首页'}, component: () => import('@/views/home/index')},
      {name: 'Home2', path: '/home2', meta: {title: '首页2'}, component: () => import('@/views/home/index')},
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index')
  },
  {
    name: 'Error403',
    path: '/403',
    component: () => import('@/views/error-page/403'),
  },
  {
    name: 'Error404',
    path: '/404',
    component: () => import('@/views/error-page/404'),
  },
  // { path: '*', redirect: '/404' }
]

export const asyncRoutes = [
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '403',
        component: () => import('@/views/error-page/403'),
        name: 'Page403',
        meta: { title: '403', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  // { path: '*', redirect: '/404'}
]

const createRouter = () => new VueRouter({
  mode: settings.isHistory ? 'history' : 'hash',
  routes: constantRoutes,
  scrollBehavior: () => ({ y: 0 })
  // base: process.env.BASE_URL,
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
