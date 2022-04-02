<template>
  <div class="app-wrapper" :class="classObj">
    <!-- 侧边栏菜单栏 -->
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container" :class="tagsView ? 'hasTagsView' : ''">
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- 顶部工具栏 -->
        <navbar />
        <!-- 标签栏 -->
        <tags-view v-if="needTagsView" />
      </div>
      <!-- 主页面 -->
      <app-main />
      <!-- 右侧系统设置 -->
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { mapState } from 'vuex'
import { Sidebar, Navbar, TagsView, AppMain, Settings } from './components'
export default {
  name: '',
  components: { Sidebar, Navbar, TagsView, AppMain, Settings, RightPanel },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      fixedHeader: (state) => state.settings.fixedHeader,
      sidebar: (state) => state.app.sidebar,
      needTagsView: (state) => state.settings.tagsView,
      showSettings: (state) => state.settings,
      tagsView: (state) => state.settings.tagsView,
    }),
    // 打开关闭侧边栏时设置class
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        // withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile',
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
