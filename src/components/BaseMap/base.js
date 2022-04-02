
let infowindow = null
import { Notification } from 'element-ui'
export default class BaseMap {

  constructor(map) {
    this.mapObj = map //  地图实例
    this.markers = [] //  标记点
    this.mapData = {} //  选中数据
    this.drawCoords = [] //  初始化传入自定义区域图形数据
    this.drawing = null //  初始化自定义多边形实例
    this.polygon = null // 绘画图形实例
    infowindow = new window.google.maps.InfoWindow({

      content: '',
      size: new window.google.maps.Size(50, 50),
    })
  }
  get () {
    return this.map
  }

  set (map) {
    this.mapObj = map
  }
  //  点击地图事件初始化
  init (searchIcon) {
    //  添加全局点击事件
    this.mapObj.addListener("click", (e) => {
      this.removeMarker(this.markers)
      this.addClickMarker(this.mapObj, searchIcon, e.latLng);
      this.showAddress(this.mapObj, this.markers[0], true)
    });
    // document.addEventListener("fullscreenchange", this.fullscreenchange.bind(this));
  }
  //  设置缩放比
  setCenter (coordinates, zoom) {
    this.mapObj.setCenter(coordinates)
    this.mapObj.setZoom(zoom)
  }
  //  绘画地图初始化
  drawInit () {
    //  添加绘画
    const drawingManager = new window.google.maps.drawing.DrawingManager({

      drawingMode: window.google.maps.drawing.OverlayType.POLYGON, //  默认选中
      // drawingMode: null, //  null时用户可以像往常一样与地图交互，并且点击不会绘制任何东西
      drawingControl: true, //绘图控件显示状态
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT, //  绘图控件位置
        drawingModes: [
          'polygon',
        ], //  绘图控件,默认为['marker', 'polyline', 'rectangle', 'circle', 'polygon']
      },
      polygonOptions: {
        editable: true,
      },

    });
    drawingManager.setMap(this.mapObj);
    //  当用户完成绘制多边形时触发此事件。
    window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => { //
      console.log('%c [ polygon ]', 'font-size:13px; background:pink; color:#bf2c9f;', polygon)
      this.polygon = polygon
      let arr = polygon.getPath().getArray()
      this.drawCoords = this.showLonLat(arr)
      // 画完一个直接设空,只能画一个
      drawingManager.setOptions({
        drawingControl: false,
      });
      drawingManager.setDrawingMode(null)
      this.customControl(JSON.stringify(this.drawCoords))
      //  监听是否改变边界值
      polygon.addListener('mouseup', () => {
        let editableChageArr = polygon.getPath().getArray()
        editableChageArr = this.showLonLat(editableChageArr)
        if (JSON.stringify(editableChageArr) !== JSON.stringify(this.drawCoords)) {
          this.drawCoords = editableChageArr
          this.customControl(JSON.stringify(this.drawCoords))
        }
      })
    })
  }
  // fullscreenchange () {
  //   if (document.fullscreenElement) {
  //     this.transformChange(1)
  //   } else {
  //     this.transformChange()
  //   }
  // }

  //  搜索事件
  searchAutocomplete (domList, newZealandBounds, clickIcon, showIcon = true) {
    const _this = this
    //  搜索
    const input = domList;
    this.mapObj.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
    //  1. 选择下拉列表
    const options = {
      bounds: newZealandBounds,
      componentRestrictions: {
        country: "us"
      },
    };
    const autocomplete = new window.google.maps.places.Autocomplete(
      input,
      options
    );
    // 对更多国家设置初始限制。
    autocomplete.setComponentRestrictions({
      country: ["us", "pr", "vi", "gu", "mp"],
    });
    //  搜索地区变化时监听事件

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }
      // For each place, get the icon, name and location.
      const bounds = new window.google.maps.LatLngBounds();
      if (showIcon) {
        this.removeMarker(this.markers)
        this.addClickMarker(this.mapObj, clickIcon, place.geometry.location)
        this.showAddress(this.mapObj, this.markers[0], true)
        //  icon点击事件
        this.markers[0].addListener("click", () => {
          _this.showAddress(_this.mapObj, _this.markers[0])
        });

        //添加拖动监听事件
        this.markers[0].addListener('dragend', function () {
          _this.showAddress(_this.mapObj, _this.markers[0])
        });
      }


      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      this.mapObj.setZoom(17);
      this.mapObj.fitBounds(bounds);
    });
  }
  //  点击添加点坐标
  addClickMarker (map, iconUrl, position, flag = true) {
    let _this = this
    const icon = {
      url: iconUrl,
      size: new window.google.maps.Size(77, 77),

      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(17, 34),
      scaledSize: new window.google.maps.Size(55, 55),
    };
    this.markers.push(new window.google.maps.Marker({
      map,
      icon,
      position,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      clickable: true
    }))

    //  添加点击事件
    if (flag) {
      //  icon点击事件
      _this.markers[0].addListener("click", (e) => {
        _this.showAddress(map, _this.markers[0], false)
      });
      //添加拖动监听事件
      _this.markers[0].addListener('dragend', function (e) {
        _this.showAddress(map, _this.markers[0], false)
      });
    }

  }
  //  
  // transformChange (x) {
  //   let ele = document.querySelector("div[aria-roledescription='map']") || document.querySelector("div[aria-roledescription='地图']")
  //   console.log('%c [ ele ]', 'font-size:13px; background:pink; color:#bf2c9f;', ele)
  //   let scaleX = x || document.getElementsByTagName('html')[0].style.transform.slice(7, -1)
  //   ele.style.transform = `scaleX(${2 - scaleX})`
  // }
  //  清除其他点座标
  removeMarker (markers) {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers.length = 0;
    this.mapData = {}
  }
  //  根据坐标获取具体信息
  showAddress (map, marker, initialization = false) {
    // this.transformChange()
    const _this = this
    var latlng = marker.getPosition();
    let geocoder = new window.google.maps.Geocoder();
    //根据经纬度获取地址信息
    geocoder.geocode({
      'latLng': latlng,

      componentRestrictions: {
        // route: 'longName',
      }
    }, function (results, status) {
      console.log('%c [ results ]', 'font-size:13px; background:pink; color:#bf2c9f;', results)
      if (status == window.google.maps.GeocoderStatus.OK) {
        // const chinaeseName = results.map(arr => {
        //   return arr.formatted_address
        // }).filter(item => item.indexOf('邮政编码') !== -1)[0]
        //  除美国以外地区不能选择
        let checkUs = results.some(item => {
          let usArr = []
          item.address_components.forEach(address => {
            if (address.short_name === 'US') {
              return usArr.push(address)
            }
          })
          if (usArr.length > 0) {
            return true
          }
        })
        if (checkUs) {
          var address = results[0].formatted_address + "<br />";
          address += "纬度：" + latlng.lat() + "<br />";
          address += "经度：" + latlng.lng() + '<br />';
          // if (chinaeseName && chinaeseName !== results[0].formatted_address) {
          //   address += chinaeseName
          // }
          address += '<div><strong>' + (initialization ? '您可以拖动图标进行定位' :
            '点击下方确定按钮选择地址') + '</strong></div>'
          infowindow.setContent(address);
          infowindow.open(map, marker);
          _this.mapData = {
            address: _this.filterData(results[0].formatted_address),
            address_components: _this.filterData(results[0].address_components),
            locations: { longitude: latlng.lng().toFixed(6), latitude: latlng.lat().toFixed(6) },
            areaList: [],
            citiesId: '',
            citiesIdChineseText: '',
            verifyCitiesIDList: [],
            longitude: latlng.lng(),
            latitude: latlng.lat(),
            latlng
          }
          //  地址特殊格式时直接拼接
          if (!_this.mapData.address) {
            _this.mapData.address = _this.mapData.address_components.map(item => {
              return item.short_name
            }).toString()
          }
          //  区域以为数组用于区域筛选
          _this.mapData.areaList = _this.areaFilter(results)
          console.log('%c [ _this.mapData ]', 'font-size:13px; background:pink; color:#bf2c9f;', _this.mapData)

        } else {
          Notification.error({
            title: '系统提示',
            message: '请选择美国地区',
            duration: 4000,
          })
          _this.removeMarker(_this.markers)
          return
        }
      } else {
        Notification.error({
          title: '系统提示',
          message: status,
          duration: 4000,
        })
        _this.mapData = {}
      }
    });
  }
  //   数据过滤 
  filterData (data) {
    //英文地址拼接数组,数组用于自己拼接地址,把国家去掉
    if (typeof data === 'object') {
      return data.filter(item => {
        return item.types.toString().indexOf('country') === -1 && item.types.toString().indexOf('postal_code_') === -1
      })
    } else {
      //  中文过滤地址
      if (data.indexOf('邮政编码') !== -1 && data.startsWith('美国')) {

        return data.split('邮政编码')[0].replace('美国', '')
      } else if (data.endsWith('美国')) {
        return data.substring(0, data.length - 8)
      } else {
        return false
      }
    }
  }

  //  区域过滤
  areaFilter (data) {
    data = data.filter(item => {
      return item.types.toString().indexOf('route') !== -1
    })
    let list = data.toString() ? data[0].address_components : this.mapData.address_components
    console.log('%c [ list ]', 'font-size:13px; background:pink; color:#bf2c9f;', list)
    let res = list.filter(item => {
      return item.types.toString().indexOf('political') !== -1
    })
    return res.map(item => {
      return item.long_name
    })
  }
  //  自定义区域查询
  customSearch (arr, coordinates) {
    if (!arr.toString() || !coordinates) return null
    let aa = arr.filter(item => {
      let triangleCoords = item.maptudes ? JSON.parse(item.maptudes) : []
      if (!triangleCoords.toString()) return false
      let bermudaTriangle = new window.google.maps.Polygon({ paths: triangleCoords })
      return window.google.maps.geometry.poly.containsLocation(
        coordinates,
        bermudaTriangle
      )
    })
    console.log('%c [ 自定义区域 ]', 'font-size:13px; background:pink; color:#bf2c9f;', aa)

    if (!aa.toString()) {
      return null
    }
    return aa[0]

  }

  //  添加地图自定义控件
  customControl (content = '', title = "坐标集合", positon = "LEFT_TOP") {


    function CenterControl (controlDiv) {
      if (document.getElementById('TEXTAREA') !== null) {
        document.getElementById('TEXTAREA').remove()
      }
      // Set CSS for the control border.
      const controlUI = document.createElement("div");
      controlUI.style.backgroundColor = "#fff";
      controlUI.style.border = "2px solid #fff";
      controlUI.style.borderRadius = "3px";
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlUI.style.cursor = "pointer";
      controlUI.style.marginTop = "8px";
      controlUI.style.marginBottom = "22px";
      controlUI.style.textAlign = "center";
      controlUI.setAttribute('id', 'TEXTAREA');
      controlDiv.appendChild(controlUI);
      // Set CSS for the control interior.
      const controlText = document.createElement("div");
      controlText.style.color = "rgb(25,25,25)";
      controlText.style.fontFamily = "Roboto,Arial,sans-serif";
      controlText.style.fontSize = "16px";
      controlText.style.lineHeight = "38px";
      controlText.style.paddingLeft = "5px";
      controlText.style.paddingRight = "5px";
      controlText.innerHTML = title;
      controlUI.appendChild(controlText);
      var input = document.createElement('TEXTAREA');
      input.setAttribute('maxlength', 123321321);
      input.value = content
      input.setAttribute('disabled', true);
      input.setAttribute('rows', 10);
      input.setAttribute('cols', 60);
      controlUI.appendChild(input);
    }
    const centerControlDiv = document.createElement("div");
    CenterControl(centerControlDiv, this.mapObj);
    this.mapObj.controls[window.google.maps.ControlPosition[positon]].push(centerControlDiv);
  }
  //根据坐标生成多边形
  drawingPolygon (arr) {
    if (typeof arr === 'string') {
      arr = JSON.parse(arr)
    }
    if (!arr || arr === null) {
      this.drawInit()
      return
    }
    this.drawCoords = arr
    this.drawing = new window.google.maps.Polygon({
      map: this.mapObj,
      paths: this.drawCoords,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.35,
      geodesic: false,
    })
  }
  showLonLat (arr) {
    let marArr = []
    arr.map(item => {
      marArr.push({
        lat: item.lat(),
        lng: item.lng()
      })
    })
    //  使坐标最后一个和第一个相同
    if (JSON.stringify(marArr[0]) !== JSON.stringify(marArr[marArr.length - 1])) {
      marArr.push(marArr[0])
    }
    return marArr
  }
  //  撤销重绘
  redraw () {
    // 撤销图形重绘
    if (this.drawing && this.drawing !== null) {
      this.drawing.setPaths([])
    }
    //  撤销绘画层
    if (this.polygon && this.polygon !== null) {
      this.polygon.setMap(null)
    }
    this.customControl('')
    this.drawCoords = ''
    this.drawInit()
  }

}