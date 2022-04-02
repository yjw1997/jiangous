export default {
  data () {
    return {
      scrollTop: 0, //  上下滚动的距离
      currentIndex: 0, //  索引 循环展示0,1,2
    }
  },
  computed: {
    times () {//  当前是第几轮
      return parseInt((this.scrollTop / (this.moduleHeight * 3)))
    }
  },
  watch: {

  },
  methods: {
    setTableData () {
      console.log(`%c [ 当前是第${this.times}轮,索引:${this.currentIndex},scrollTop:${this.scrollTop} ]`, 'font-size:13px; background:pink; color:#bf2c9f;')
      this.showTableList = this.tableList.slice((this.times * this.itemNum * 3 + this.itemNum * this.currentIndex), (this.times * this.itemNum * 3 + this.itemNum * this.currentIndex) + 3 * this.itemNum)

    },
    //  滚动条事件
    handleScroll () {
      const { scrollTop, scrollLeft } = this.dom
      // 滚动距离
      this.scrollLeft = scrollLeft
      this.currentIndex = parseInt((scrollTop % (this.moduleHeight * 3)) / this.moduleHeight)
      this.scrollTop = scrollTop
      this.$nextTick(() => {
        this.setTopPlace();
      });
    },

  }
}