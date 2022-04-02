<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeActive">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            <tab-pane v-if="activeName == item.key" :type="item.key" :activeName="activeName" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
export default {
  name: 'goods_list',
  components: { TabPane },
  props: {},
  data() {
    return {
      activeName: 'tab-0',

      tabMapOptions: [
        { label: '全部商品', key: 'tab-0' },
        { label: '出售中的商品', key: 'tab-1' },
        { label: '仓库中的商品', key: 'tab-2' },
        { label: '待核验', key: 'tab-3' },
        { label: '待审核', key: 'tab-4' },
        { label: '审核不通过', key: 'tab-5' },
      ],
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$route.query && vm.$route.query.edit) {
        vm.activeName = JSON.parse(decodeURIComponent(vm.$route.query.edit)).active || 'tab-0'
      }
    })
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeActive() {
      console.log('%c [ changeActive ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.activeName)
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-tabs--border-card {
  border: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
