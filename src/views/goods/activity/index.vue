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
  name: 'activity_list',
  components: { TabPane },
  props: {},
  data() {
    return {
      activeName: 'tab-',
      tabMapOptions: [
        { label: '全部活动', key: 'tab-' },
        { label: '未开始', key: 'tab-0' },
        { label: '报名中', key: 'tab-1' },
        { label: '进行中', key: 'tab-4' },
        { label: '已结束', key: 'tab-5' },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  activated() {
    console.log('%c [ activated ]', 'font-size:13px; background:pink; color:#bf2c9f;', 'activated')
  },
  methods: {
    changeActive() {
      console.log('%c [ changeActive ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.activeName)
    },
  },
}
</script>

<style scoped lang="scss"></style>
