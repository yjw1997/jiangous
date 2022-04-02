<template>
  <div class="table">
    <el-table
      v-bind="$attrs"
      :data="showTableList"
      ref="table"
      :row-style="{ height: rowHeight.toString().endsWith('px') ? rowHeight : rowHeight + 'px' }"
    >
      <template v-for="(item, index) in $attrs.columns">
        <slot v-if="item.slot"></slot>
        <el-table-column v-bind="item" :key="index"> </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import mixins from './mixins'
import { throttle } from '@/utils/throttle'
export default {
  name: 'dataList',
  mixins: [...mixins],
  components: {},
  props: {
    tableList: {
      //所有表格数据
      type: Array,
      default() {
        return []
      },
    },
    itemNum: {
      //默认加载行数
      type: [Number, String],
      default() {
        return 20
      },
    },
    rowHeight: {
      //  默认行高,当行高小于默认最小值时会不再缩小
      type: [Number, String],
      default() {
        return '53'
      },
    },
  },
  data() {
    return {
      dom: null, //  table dom
      showTableList: [], //  显示的表格数据
      scrollProcessing: null,
    }
  },
  computed: {},
  watch: {
    tableList: {
      handler(newsVal) {
        console.log('%c [  this.$refs.table ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.$refs.table)
        if (newsVal.length > 0) {
          this.showTableList = newsVal.slice(0, this.itemNum * 3)
          this._tableResize()
        }
      },
    },
  },
  created() {},
  mounted() {
    this.dom = this.$refs.table.bodyWrapper // 获取需要绑定的table
    this.scrollProcessing = throttle(this.handleScroll, 200) // 函数节流
    this.dom.addEventListener('scroll', this.scrollProcessing) // 添加监听事件
  },
  methods: {
    throttle,
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollProcessing) //  移除监听事件
  },
}
</script>

<style scoped lang="scss">
.bottomBoxHeight {
  display: flex;
  bottom: 0;
}
</style>
