<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeActive">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            <tab-pane
              v-if="activeName == item.key"
              :type="item.key"
              :activeName="activeName"
              :activityId="activityId"
            />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
export default {
  name: '',
  components: { TabPane },
  props: {},
  data() {
    return {
      activeName: 'tab-',
      tabMapOptions: [
        { label: '全部商品', key: 'tab-' },
        { label: '待审核', key: 'tab-0' },
        { label: '审核通过', key: 'tab-1' },
        { label: '审核驳回', key: 'tab-2' },
      ],
      activityId: '',
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.$router.push({ path: '/goods/activity' })
      }
    })
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeActive() {},
  },
}
</script>

<style scoped lang="scss"></style>
