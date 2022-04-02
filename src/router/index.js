import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   meta: { title: '平台', icon: 'platform' },
  //   redirect: 'index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: (resolve) => require(['@/views/platform/dashboard/index_v1'], resolve),
  //       name: '首页',
  //       meta: { title: '首页', icon: 'dashboard', noCache: false, affix: true, parentPath: '/' }
  //     },
  //     // {
  //     //   path: 'statistics',
  //     //   component: (resolve) => require(['@/views/dashboard/index_statistics'], resolve),
  //     //   name: '渠道投放统计',
  //     //   meta: { title: '渠道投放统计', icon: 'statistics', noCache: false, parentPath: '/' }
  //     // }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '/role',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/role/:code',
        component: (resolve) => require(['@/views/system/role/distributionUser'], resolve),
        name: 'distributionUser',
        meta: { title: '分配用户', icon: '' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/gen/edit/:tableId',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'genEdit',
        meta: { title: '修改生成配置', icon: '' }
      }
    ]
  },

]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router