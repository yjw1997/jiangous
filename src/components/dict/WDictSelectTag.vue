<template>
  <el-radio-group v-if="tagType == 'radio'" :value="value" :disabled="disabled">
    <el-radio v-for="(item, key) in dictOptions" :key="key" :label="item.dicKey" @change="handleInput(item.value)">{{
      item.dicValue
    }}</el-radio>
  </el-radio-group>

  <el-select
    :popper-append-to-body="false"
    v-else-if="tagType == 'select'"
    :getPopupContainer="(target) => target.parentNode"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="getValueSting"
    @change="handleInput"
    :multiple="multiple"
    filterable
    collapse-tags
  >
    <!-- <el-option v-if="undefinedNo" :value="undefined">请选择</el-option> -->
    <el-option v-for="(item, key) in dictOptions" :key="key" :value="item.dicKey" :label="item.dicValue"> </el-option>
  </el-select>
  <!-- //  全部:搜索时可用 -->
  <el-radio-group v-else-if="tagType == 'tabs'" :value="value" :style="{ marginRight: '8px' }">
    <el-radio :value="undefined" @change="handleInput(undefined)">全部</el-radio>
    <el-radio v-for="(item, key) in dictOptions" :key="key" :label="item.dicKey" @change="handleInput(item.value)">{{
      item.dicValue
    }}</el-radio>
  </el-radio-group>
</template>

<script>
import { getSelectDictDataList } from '@/api/api'
export default {
  name: 'WDictSelectTag',
  props: {
    dictCode: String,
    placeholder: {
      type: String,
      default: '请选择',
    },
    triggerChange: Boolean,
    undefinedNo: { type: Boolean, default: true },
    disabled: Boolean,
    value: [String, Number],
    type: String,
    multiple: Boolean,
    spliter: {
      type: String,
      required: false,
      default: ',',
    },
  },
  data() {
    return {
      dictOptions: [],
      tagType: '',
    }
  },
  watch: {
    dictCode: {
      immediate: true,
      handler() {
        this.initDictData()
      },
    },
  },
  created() {
    // console.log(this.dictCode);
    if (!this.type || this.type === 'list') {
      this.tagType = 'select'
    } else {
      this.tagType = this.type
    }
    // 获取字典数据
    // this.initDictData()
  },
  computed: {
    getValueSting: {
      get() {
        return this.value !== undefined && this.value !== null ? this.value.toString() : undefined
      },
    },
  },
  methods: {
    initDictData() {
      // 根据字典Code, 初始化字典数组
      console.log('dictCode', this.dictCode)
      getSelectDictDataList({ tip: this.dictCode }).then((res) => {
        if (res.code === 0) {
          this.dictOptions = res.data
          console.log('dictOptions>>>>>>>', this.dictOptions)
        }
      })
    },
    handleInput(e) {
      console.log(e)
      let val = e
      console.log(val)
      this.$emit('change', this.multiple ? val.join(this.spliter) : val)
    },
    setCurrentDictOptions(dictOptions) {
      this.dictOptions = dictOptions
    },
    getCurrentDictOptions() {
      return this.dictOptions
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
}
</script>

<style scoped></style>
