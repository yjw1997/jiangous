import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched && to.matched.length > 2) {
    to.matched.forEach((item, index) => {
      if (item.components.default.name === 'ParentView') {
        to.matched.splice(index, 1)
      }
    })
  }
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断当前用户是否已拉取完user_info信息
      if (!store.getters.permission_routes || !store.getters.permission_routes.toString()) {
        store.dispatch('GenerateRoutes').then(accessRoutes => {
          // 根据roles权限生成可访问的路由表
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          console.log('%c [ accessRoutes ]', 'font-size:13px; background:pink; color:#bf2c9f;', accessRoutes)
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        }).catch(err => {
          store.dispatch('LogOut').then(() => {
            Message.error(err)
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})