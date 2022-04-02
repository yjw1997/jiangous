<template>
  <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect">
    <template v-for="(item, index) in topMenus">
      <el-menu-item :style="{ '--theme': theme }" :index="item.path" :key="index" v-if="index < visibleNumber"
        ><svg-icon :icon-class="item.meta.icon" /> {{ item.meta.title }}</el-menu-item
      >
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-submenu index="more" v-if="topMenus.length > visibleNumber">
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item :index="item.path" :key="index" v-if="index >= visibleNumber"
          ><svg-icon :icon-class="item.meta.icon" /> {{ item.meta.title }}</el-menu-item
        >
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      // 顶部栏初始数
      visibleNumber: 5,
      // 是否为首次加载
      isFrist: false,
      // 当前激活菜单的 index
      currentIndex: undefined,
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    // 顶部显示菜单
    topMenus() {
      let topMenus = []
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          topMenus.push(menu)
        }
      })
      return topMenus
    },
    // 所有的路由信息
    routers() {
      return this.$store.state.menu.routes
    },

    // 默认激活的菜单
    activeMenu() {
      const route = this.$route
      let parentPath = route.meta && route.meta.parentPath ? route.meta.parentPath : ''
      let activePath = this.topMenus[0].path //  第一个地址hash
      if ('/index' == parentPath || '' == parentPath || '/' == parentPath) {
        activePath = 'index'
      } else {
        activePath = parentPath
      }
      var routes = this.activeRoutes(activePath)
      //  页面初始化的事情默认激活菜单
      if (routes.length === 0) {
        activePath = this.currentIndex || this.routers[0].path
        this.activeRoutes(activePath)
      }
      return parentPath
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.setVisibleNumber)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setVisibleNumber)
  },
  mounted() {
    this.setVisibleNumber()
  },
  methods: {
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3
      this.visibleNumber = parseInt(width / 85)
    },
    // 菜单选择事件
    handleSelect(key, keyPath) {
      this.currentIndex = key
      if (this.ishttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, '_blank')
      } else if (key.indexOf('/redirect') !== -1) {
        // /redirect 路径内部打开
        this.$router.push({ path: key.replace('/redirect', '') })
      } else {
        // 显示左侧联动菜单
        this.activeRoutes(key)
      }
    },
    // 当前激活的路由
    activeRoutes(key) {
      console.log('%c [ key ]', 'font-size:13px; background:pink; color:#bf2c9f;', key)
      var routes = []
      if (this.topMenus && this.topMenus.length > 0) {
        this.topMenus.map((item) => {
          let parentPath = item.path
          if (key == parentPath || (key === 'index' && parentPath === '/')) {
            routes.push(...item.children)
          }
        })
      }
      if (routes.length > 0) {
        this.$store.commit('SET_SIDEBAR_ROUTERS', routes)
      }
      return routes
    },
    ishttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    },
  },
}
</script>

<style lang="scss">
.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  margin: 0;
  border-bottom: 3px solid transparent;
  color: #999093;
  padding: 0 10px;
  margin: 0 10px;
  font-size: 17px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #{'var(--theme)'};
  color: #303133;
}

/* submenu item */
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
}
</style>
