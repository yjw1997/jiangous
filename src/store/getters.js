const getters = {
  roles: (state) => state.user.roles,
  sidebar: state => state.app.sidebar,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.menu.routes,
  sidebarRouters: state => state.menu.sidebarRouters,
}
export default getters
