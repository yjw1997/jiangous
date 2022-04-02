module.exports = {
  title: 'JIANSHOPS',

  /**
 * 侧边栏主题 深色主题theme-dark  ，浅色主题theme- 
 */
  sideTheme: 'theme-',
  /**
   * @type {boolean} true | false
   * @description 刷新时是否显示系统布局配置
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示 tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否固定头部
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否展示logo
   */
  sidebarLogo: true,

  /****
   * 是否显示顶部菜单topNav
   */
  topNavSetting: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
