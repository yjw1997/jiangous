export default {
  data () {
    return {
      totalRowHeight: 0, // 如果全量渲染应该是多高，用于计算占位
      topPlaceholderHeight: 0, // 顶部占位容器高度
      moduleHeight: 0, // 三个tr块中的一块的高度
    }
  },
  computed: {
    itemRowHeight () {//  单个item高度
      return this.rowHeight === undefined ? 53 : this.rowHeight;
    },

    placeholderHeight () {
      return this.totalRowHeight - this.moduleHeight * 3; // 占位容器的总高度(上 + 下)
    },
    bottomPlaceholderHeight () {
      return (this.placeholderHeight - this.topPlaceholderHeight) < 0 ? 0 : this.placeholderHeight - this.topPlaceholderHeight;
    },

  },
  watch: {
    topPlaceholderHeight () {
      console.log('触发函数')
      this.changeTheaerAndTailBoxes()
      this.setTableData()
    }
  },
  methods: {
    _tableResize () {
      console.log(this.placeholderHeight)
      this.$nextTick(() => {
        this.setComputedProps()
        this.setTopPlace()
        this.changeTheaerAndTailBoxes()
      })
    },

    // 初始化添加头部和尾部盒子
    initTheaerAndTailBoxes () {
      let divDom = document.createElement('div')
      let tableDom = this.dom.getElementsByTagName('table')[0]
      divDom.className = 'dataTop'
      divDom.style.height = this.topPlaceholderHeight + 'px'
      this.dom.insertBefore(divDom, tableDom)
      let divDom2 = document.createElement('div')
      divDom2.className = 'dataBottom'
      divDom2.style.height = this.bottomPlaceholderHeight + 'px'
      this.dom.appendChild(divDom2)
    },
    //  滚动时上下盒子跟随变化
    changeTheaerAndTailBoxes () {
      let dataTopDom = document.getElementsByClassName('dataTop')
      let dataBottomDom = document.getElementsByClassName('dataBottom')
      if (!Array.from(dataTopDom).toString() || !Array.from(dataBottomDom).toString()) {
        this.initTheaerAndTailBoxes()
      }
      dataTopDom[0].style.height = this.topPlaceholderHeight + 'px'
      dataBottomDom[0].style.height = this.bottomPlaceholderHeight + 'px'
    },
    setTopPlace () {
      let scrollTop = this.scrollTop
      let topPlaceholderHeight = parseInt(scrollTop / this.moduleHeight) * this.moduleHeight > this.placeholderHeight ? this.placeholderHeight : parseInt(scrollTop / this.moduleHeight) * this.moduleHeight;
      if (topPlaceholderHeight > this.topPlaceholderHeight) { //  下滚时滚动条因为上面占位高度变化而变化,拉回来一个位置
        this.dom.scrollTop = this.scrollTop - this.moduleHeight
      }
      this.topPlaceholderHeight = topPlaceholderHeight

    },
    setComputedProps () {
      const len = this.tableList.length;
      this.totalRowHeight = len * this.itemRowHeight; //  总体高度
      this.moduleHeight = this.itemNum * this.itemRowHeight;
    },
  }
}