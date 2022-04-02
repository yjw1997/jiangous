import { constantRoutes } from '@/router'
import { getRouters } from '@/api/login'
import Layout from '@/layout/index'
import { handleTree } from '@/utils/index'
import ParentView from '@/components/ParentView';
import { menuslyt } from '@/utils/menuslyt.js'

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    sidebarRouters: [],
    originalRoutes: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_SIDEBAR_ROUTERS: (state, routers) => {
      state.sidebarRouters = routers
    },
    SET_ORIGINAL_ROUTES: (state, routers) => {
      state.originalRoutes = routers
    },

  },
  actions: {
    // 生成路由
    GenerateRoutes ({ commit }) {
      // 向后端请求路由数据
      return new Promise((resolve, reject) => {
        getRouters().then(res => {
          let routes = res.data.filter(item => item)
          /* v1.1.0 */
          routes.push(...menuslyt)
          routes = handleTree(routes, 'code', 'parentCode')
          const sdata = JSON.parse(JSON.stringify(routes))
          const rdata = JSON.parse(JSON.stringify(routes))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          addTags(rewriteRoutes)
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          resolve(rewriteRoutes)

        }).catch(err => {
          console.log('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err)
          reject(err)
        })

      })

    },
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter (asyncRouterMap, type = false) {
  return asyncRouterMap.filter(route => {
    //  循环遍历为每个子节点打上标记
    route.path = route.route
    route.meta = {
      icon: route.icon,
      title: route.name,
      code: route.code,
      noCache: route.cacheFlag
    }
    if (route.path) {
      // Layout ParentView 组件特殊处理
      if (route.parentCode === 'NONE' || route.parentCode === null || !route.parentCode) {
        route.component = Layout
        route.redirect = route.path === '/' ? 'index' : "noRedirect"
        route.alwaysShow = true
      } else if (route.parentCode !== 'NONE' && route.children && route.children.length > 0) {
        //  多级菜单处理
        route.component = ParentView
      } else {
        // 底层路由
        route.component = loadView(route.path)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
      // route.redirect = filterRedirectPath(route.children)
      // route.redirect = route.children[0].url
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}
//  多级菜单breadcrumb重定向问题
export const filterRedirectPath = (asyncRouterMap) => {
  let url = ''
  try {
    asyncRouterMap.forEach(route => {
      if (route.children != null && route.children && route.children.length) {
        filterRedirectPath(route.children)
      } else {
        url = route.path
        throw new Error(url);
      }
    })
  } catch (e) {
    return url
  }

}

function addTags (routes) {
  return routes.filter(route => {
    let parentPath = route.path
    if (route.children && route.children.length)
      addTagsParentPath(route.children, parentPath)
  })

}

function addTagsParentPath (routes, parentPath) {
  routes.filter(route => {
    if (route.children != null && route.children && route.children.length) {
      addTagsParentPath(route.children, parentPath)
    } else {
      route.meta.parentPath = parentPath
    }
  })
}
export const loadView = (view) => { // 路由懒加载
  if (view === 'index') {
    return () =>
      import(`@/views/platform/dashboard/index_v1`)
  }
  return () =>
    import(`@/views${view}`)
}

export default permission