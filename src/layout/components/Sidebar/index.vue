<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse"></logo>
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'"
        :unique-opened="true"
        :active-text-color="settings.sideTheme === 'theme-dark' ? 'rgba(255,255,255)' : settings.theme"
        mode="vertical"
      >
        <sidebar-item v-for="route in sidebarRouters" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import logo from './logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  name: '',
  components: { logo, SidebarItem },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['sidebarRouters']),

    //  点击切换路由,和tabs互相响应
    activeMenu() {
      const route = this.$route
      return route.path
    },
    //  是否展示logo
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    //  菜单打开关闭开关
    isCollapse() {
      return !this.$store.state.app.sidebar.opened
    },
    //  全局样式文件
    variables() {
      return variables
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.el-menu-item + .is-active {
  background-image: linear-gradient(45deg, #3da1f0, #9464c9) !important;
}
</style>
