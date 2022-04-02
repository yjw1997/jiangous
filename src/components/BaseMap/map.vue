<template>
  <div class="map-container">
    <div :id="mapId" :style="{ width, height }"></div>
    <div class="searchPlace">
      <input id="pac-input" class="controls" type="text" placeholder="google search" />
    </div>
  </div>
</template>
<script>
let mapObj = {}
const googleMapCDN =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyDEboIuY52vuRQHnYSiWRjMcp6f62UjaTI&libraries=places,geometry,drawing&v=&region=US&language=en'
import load from './dynamicLoadScript'
export default {
  name: 'BaseMap',
  components: {},
  props: {
    options: {
      // 地图基础信息
      type: Object,
      default: () => {},
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    NEW_ZEALAND_BOUNDS: {
      // 边界值
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      mapId: 'map_' + new Date().getTime(),
    }
  },
  mounted() {
    this.loadRongJs()
  },
  methods: {
    loadRongJs() {
      console.log('%c [ loadRongJs ]', 'font-size:13px; background:pink; color:#bf2c9f;', 'loadRongJs')
      load(googleMapCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.init()
        this.$emit('InitializationCompleted', mapObj)
      })
    },
    init() {
      //  初始化完成发送消息给父主键
      // 基本地图加载
      if (this.options && this.options.id) {
        this.mapId = this.options.id
      }
      let zoom = this.options && this.options.zoom ? this.options.zoom : 5
      mapObj = new window.google.maps.Map(document.getElementById(this.mapId), {
        center: {
          lat: 37.09024,
          lng: -95.712891,
        },
        maxZoom: zoom + 15,
        restriction: {
          latLngBounds: this.NEW_ZEALAND_BOUNDS,
          strictBounds: false,
        },
        zoom,

        ...this.options,
      })
    },
    getMapObj() {
      return mapObj
    },
    getSearchBox() {
      return document.getElementById('pac-input')
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.map-container {
  position: relative;
}
img {
  transform: none !important;
}
#pac-input {
  background-color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 392px;
  height: 48px;
  position: absolute;
  top: 12px !important;
  left: 50% !important;
  margin-left: -194px !important;
}

#pac-input:focus {
  border-color: #4d90fe;
}

#title {
  color: #fff;
  background-color: #4d90fe;
  font-size: 25px;
  font-weight: 500;
  padding: 6px 12px;
}

#target {
  width: 345px;
}
</style>
