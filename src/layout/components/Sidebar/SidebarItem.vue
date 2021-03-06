<template>
  <div v-if="!item.hidden">
    <!-- 二级菜单 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 多级菜单 -->
    <el-submenu ref="subMenu" v-else popper-append-to-body :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="(child, index) in item.children"
        :key="child.path + index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
        :index="resolvePath(item.path)"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import Item from './Item'
import AppLink from './Link'
import { isExternal } from '@/utils/validate'
export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // 临时设置(将在只有一个显示子元素时使用)
          this.onlyOneChild = item
          return true
        }
      })
      // 当只有一个子路由器时，默认显示该子路由器
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有子路由器显示，则显示parent
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    //  路径已https开头拼为绝对路径返回
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
  },
}
</script>

<style scoped lang="scss"></style>
