<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page="ipagination.currentPage"
      :page-size="ipagination.pageSize"
      :layout="ipagination.layout"
      :page-sizes="ipagination.pageSizeOptions"
      :total="parseInt(ipagination.total)"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    ipagination: {
      require: true,
      type: Object,
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
    },
  },
  methods: {
    handleSizeChange(val) {
      this.ipagination.pageSize = val
      this.$parent.loadData ? this.$parent.loadData() : this.$emit('pagination')
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.ipagination.current = val
      this.$parent.loadData ? this.$parent.loadData() : this.$emit('pagination')
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
  },
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
