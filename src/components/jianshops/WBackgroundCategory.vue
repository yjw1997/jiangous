<template>
  <el-cascader
    :options="options"
    :value="multiple ? arrayValue : modelValue"
    :props="{ checkStrictly, multiple, label, value, emitPath }"
    clearable
    filterable
    :collapse-tags="multiple"
    :show-all-levels="showAll"
    @change="handleSubmit"
    ref="cascader"
  ></el-cascader>
</template>

<script>
import { getBackgroundClassifyList } from '@/api/api'
export default {
  name: '',
  components: {},
  props: {
    /**是否可以选择任意一级,false情况下只能选择最后一级*/
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    /***是否可以多选 */
    multiple: {
      type: Boolean,
      default: false,
    },
    /***是否可以只展示最后一级 */
    showAll: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'classifyName',
    },
    value: {
      type: String,
      default: 'classifyCode',
    },
    spliter: {
      type: String,
      required: false,
      default: ',',
    },
    /***当前选中的值用于双向数据绑定 */
    modelValue: {
      type: [String, Array],
      default: '',
    },
    allSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**false返回只当前选中的节点值,true返回该节点所在的各级菜单的值所组成的数组 */
    emitPath: {
      type: Boolean,
      default: false,
      selectAllIDArr: [], //  全部数据的ID
    },
    limit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: [],
      arrayValue: !this.modelValue ? [] : this.modelValue.split(this.spliter),
      selectStates: false, //  是否点击了全选
    }
  },
  computed: {},
  watch: {
    modelValue(val) {
      console.log('%c [ val ]', 'font-size:13px; background:pink; color:#bf2c9f;', val)
      if (!val) {
        this.arrayValue = []
      } else {
        this.arrayValue = this.modelValue.split(this.spliter)
      }
    },
  },
  created() {
    this.init()
  },
  mounted() {},
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  methods: {
    init() {
      getBackgroundClassifyList().then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        res.data.sort((a, b) => {
          return a.sort - b.sort
        })
        console.log('%c [ res.data ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.data)
        let arr = this.handleTree(res.data, 'classifyCode', 'parentCode')

        this.options = this.limit
          ? arr.filter((item) => item.children && item.children !== null && item.children.length !== 0)
          : arr
      })
    },
    handleSubmit(value) {
      this.$emit('change', this.multiple ? value.join(this.spliter) : value)
    },
    getParentIds() {
      if (this.multiple) return
      let arr = this.$refs.cascader.getCheckedNodes()[0].path.filter((item) => item !== this.modelValue)
      return arr.length === 0 ? '' : arr.join(this.spliter)
    },
  },
}
</script>

<style scoped lang="scss"></style>
