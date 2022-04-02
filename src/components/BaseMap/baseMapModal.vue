<template>
  <div>
    <el-dialog
      :show-close="false"
      :visible.sync="mapDialogVisible"
      width="90%"
      :close-on-click-modal="false"
      center
      class="dialogMap"
      top="3vh"
      append-to-body
    >
      <base-map
        ref="baseMapRefs"
        :options="mapOptions"
        :height="height"
        :NEW_ZEALAND_BOUNDS="newZealandBounds"
        @InitializationCompleted="initMap"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import clickIcon from '@/assets/maps/coordinates.png'
let MapObj = {}
import { baseMap, MapService } from '@/components/BaseMap'
export default {
  name: '',
  components: {
    baseMap,
  },
  props: {},
  data() {
    return {
      mapDialogVisible: false,
      height: 'calc(100vh - 190px)',
      mapOptions: { zoom: 5 },
      newZealandBounds: {
        east: -65,
        west: -178,
        south: 24,
        north: 72,
      },
    }
  },
  computed: {},
  watch: {
    mapDialogVisible(val) {
      //  初始化之后再次进入刷新地图
      if (val) {
        if (this.$refs.baseMapRefs) {
          this.$refs.baseMapRefs.loadRongJs()
        }
      }
    },
  },
  created() {},
  methods: {
    initMap() {
      MapObj = new MapService(this.$refs.baseMapRefs.getMapObj())
      //  添加全局点击事件
      MapObj.init(clickIcon)
      //  添加搜索事件
      MapObj.searchAutocomplete(this.$refs.baseMapRefs.getSearchBox(), this.newZealandBounds, clickIcon)
      // MapObj.transformChange()
    },
    handleSubmit() {
      this.$emit('change', MapObj.mapData)
      this.close()
    },
    close() {
      this.mapDialogVisible = false
      this.destroy()
    },
    destroy() {
      document.removeEventListener('fullscreenchange', this.fullscreenchange)
    },
  },
  beforeDestroy() {},
}
</script>

<style>
.pac-container {
  z-index: 200000 !important;
}
</style>
