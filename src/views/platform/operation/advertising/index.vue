<template>
  <div class="dashboard-editor-container">
    <div class="content-box" v-loading="loading">
      <el-tabs v-model="activeName">
        <el-tab-pane label="首页轮播" name="tab-0">
          <home :activeName="activeName"></home>
        </el-tab-pane>
        <el-tab-pane label="分类页广告" name="tab-1">
          <classify :activeName="activeName"></classify>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import home from './home.vue'
import classify from './classify.vue'
export default {
  name: '',
  components: { classify, home },
  props: {},
  data() {
    return {
      loading: false,
      activeName: 'tab-0',
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.button {
  position: absolute;
  right: 38px;
  top: 35px;
  z-index: 9999;
}
.el-descriptions__title {
  margin-left: 40px;
  padding: 20px 0;
  font-size: 18px;
}
</style>
