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
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button type="primary" @click="handleReDraw">开始绘制/撤销重绘</el-button>
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
      showBaseMap: false,
      height: 'calc(100vh - 190px)',
      mapOptions: { zoom: 5 },
      form: {},
      newZealandBounds: {
        east: -65,
        west: -178,
        south: 24,
        north: 72,
      },
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    initMap() {
      console.log('%c [ initMap ]', 'font-size:13px; background:pink; color:#bf2c9f;', 'initMap')
      MapObj = new MapService(this.$refs.baseMapRefs.getMapObj())
      //  初始化生成多边形
      MapObj.drawingPolygon(this.form.maptudes)

      //  添加搜索事件
      MapObj.searchAutocomplete(this.$refs.baseMapRefs.getSearchBox(), this.newZealandBounds, clickIcon, false)
      //添加地图自定义控件
      //  自定义控件
      MapObj.customControl(this.form.maptudes)
      //  定位
      let maptudes = this.form.maptudes && this.form.maptudes !== null ? JSON.parse(this.form.maptudes) : ''
      if (maptudes !== null && maptudes) {
        MapObj.setCenter(maptudes[0], 8)
      } else {
        MapObj.setCenter(
          {
            lat: 37.09024,
            lng: -95.712891,
          },
          5,
        )
      }
    },
    handleReDraw() {
      MapObj.redraw()
    },
    handleSubmit() {
      if (!MapObj.drawCoords) {
        this.$message.warning('请选择你的自定义区域')
        return
      }
      this.$emit('change', { ...this.form, maptudes: JSON.stringify(MapObj.drawCoords) })
      this.close()
    },
    close() {
      this.mapDialogVisible = false
    },
  },
}
</script>

<style>
.pac-container {
  z-index: 200000 !important;
}
</style>
