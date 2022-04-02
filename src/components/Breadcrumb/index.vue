<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  components: {},
  props: {},
  data() {
    return {
      levelList: null,
    }
  },
  computed: {},
  watch: {
    $route(route) {
      //  页面重定向刷新不需要更新面包屑
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  mounted() {},
  methods: {
    //  获取this.$route.matched
    getBreadcrumb() {
      let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
      //  判断是否有主页如果没有的话添加主页
      if (!this.isDashboard(matched[0])) {
        matched = [{ path: '/index', meta: { title: '首页' } }, ...matched]
      }
      this.levelList = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      //  判断名字存不存在
      const name = (route && route.name) || (route && route.meta && route.meta.title)
      if (!name) {
        return false
      }
      return name.trim() === '首页'
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    },
  },
}
</script>

<style scoped lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
