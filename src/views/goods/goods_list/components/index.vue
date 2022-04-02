<template>
  <div>
    <!-- 分享商品 -->
    <el-dialog title="分享商品" :visible.sync="shareModal" width="700px" :close-on-click-modal="true" destroy-on-close :before-close="beforeClose">
      <div class="head">
        <el-image :src="goods.goodsPic"></el-image> 
        <div class="goods-detail">
          <div>ID: {{ goods.goodsId }}</div>
          <div>{{ goods.goodsName }}</div> 
        </div>
      </div>

      <div class="centent">
        <div>
          <div class="title">分享链接</div>
          <div class="link">{{ shareLink }}</div>
          <div class="btn-box"><el-button type="primary" size="small" @click="copyLink">复制</el-button></div>
        </div>
        <!-- {{qrUrl}} v-loading="qrLoading"-->
        <div>
          <div class="title">分享二维码</div>
          <el-image :src="qrUrl" class="qr-img" v-if="isEmpty(qrUrl)" @load="QRLoad">
            <div slot="placeholder" class="image-slot"><i class="el-icon-loading"></i></div>
            <div slot="error" class="image-slot"><i class="el-icon-picture"></i></div>
          </el-image>
          <div style="color: #aaa;">右键点击图片复制或下载</div>
        </div>

        <div>
          <div class="title">分享海报</div>
          <div ref="appendNode"></div>
          <div class="poster-box" v-show="false">
            <div ref="posterNode" class="poster">
              <div class="poster-title">简购</div>
              <div class="poster-tip">简购商城带你省心购好物</div>
              <div>
                <!-- <el-image :src="goods.goodsPic" class="goods-img" @load="goodsPicLoad" @error="goodsPicLoad">
                  <div slot="placeholder" class="image-slot"><i class="el-icon-loading"></i></div>
                  <div slot="error" class="image-slot"><i class="el-icon-picture"></i></div>
                </el-image> -->
                <img :src="goods.goodsPic" class="goods-img" @load="goodsPicLoad" @error="goodsPicLoads">
              </div>
              <div class="desc">
                <div class="goodsname">{{ goods.goodsName }}</div>
                <div class="price">${{ goods.price && goods.price.toFixed(2) }}</div>
              </div>
              <div class="poster-footer">
                <div class="qr-box">
                  <el-image :src="qrUrl" class="qr-img" v-if="isEmpty(qrUrl)">
                    <div slot="placeholder" class="image-slot"><i class="el-icon-loading"></i></div>
                    <div slot="error" class="image-slot"><i class="el-icon-loading"></i></div>
                  </el-image>
                </div>
                <div class="poster-footer-tips">
                  <div style="font-size:12px">长按二维码,即可查看商品详情</div>
                  <div>分享自 简购商家</div>
                </div>
              </div>
            </div>
          </div>

          <div style="color: #aaa;">右键点击图片复制或下载</div>
        </div>
      </div>

      <div class="footer">您可以分享至微信邀请购买</div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import domtoimage from './lib/dom-to-img.js'
import { isEmpty } from '@/utils/index'
export default {
  // props: {
  //   goods: Object,
  // },
  data() {
    return {
      shareModal: false,
      qrLoading: false,
      shareLink: '',
      qrUrl: '',
      qrLoad: false,
      picLoad: false,
      goods:''
    }
  },
  watch: {
    qrLoad(newValue, oldValue) {
      if (newValue && this.picLoad) {
        this.$nextTick(() => {
          this.makePoster()
        })
      }
    },
    picLoad(newValue, oldValue) {
      if (newValue && this.qrLoad) {
        this.$nextTick(() => {
          this.makePoster()
        })
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    isEmpty,
    show() {
      this.shareModal = true
      this.$nextTick(() => {
        console.log(this.goods);
        this.makeQRCode()
      })
    },
    QRLoad(e) {
      // this.qrLoading = false
      this.qrLoad = true
    },
    goodsPicLoad(e) {
      this.picLoad = true
    },
    goodsPicLoads(){
       this.$message.error("图片加载失败,请点击重试")
    },
    makePoster() {
      // this.qrLoading = false
      let node = this.$refs.posterNode
      let appendNode = this.$refs.appendNode
      let that = this
      domtoimage
        .toPng(node, { scale: 2, width: 240, height: 360 })
        .then(function(dataUrl) {
          var img = new Image()
          img.src = dataUrl
          img.style.width = '80%'
          img.style.margin = '10px 0'
          appendNode.innerHTML = ''
          appendNode.appendChild(img)
        })
        .catch(function(error) {
          console.error('oops, something went wrong!', error)
        })
    },
    copyLink() {
      const el = document.createElement('textarea')
      el.value = this.shareLink
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px' // 移出屏幕外以使其不可见
      document.body.appendChild(el)
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }

      this.$message.success('复制成功')
    },
    makeQRCode() {
      /* 'http://192.168.0.231:8012/#/pages/common/goodsDetail/goodsDetail?detail=' + JSON.stringify( {
              goodsId: goodsId,
              goodsType:goodsType,
            }
        ) */
      const link =
        process.env.NODE_ENV === 'production'
          ? 'https://h5.jianshops.com'
          : process.env.NODE_ENV === 'fat'
          ? 'http://fat-user-h5.us168168.com'
          : process.env.NODE_ENV === 'development'
          ? 'http://192.168.0.231:8002'
          : 'http://fat-user-h5.us168168.com'
      const pram = {
        goodsId: this.goods.goodsId,
        goodsType: 1,
      }
      const shareLink = `${link}/#/pages/common/goodsDetail/goodsDetail?detail=${JSON.stringify(pram)}`

      this.shareLink = shareLink

      let that = this
      // this.$refs.qrcodeCanvas,
      QRCode.toDataURL(shareLink, function(error, url) {
        if (error) {
          that.$message.error(error)
        }
        that.qrUrl = url
      })
    },
    beforeClose(done) {
      this.qrLoading = false 
      this.shareLink = ''
      this.qrUrl = ''
      this.qrLoad = false
      this.picLoad = false

      done()
    },
  },
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  .el-image {
    height: 50px;
    width: 50px;
    margin-right: 15px;
  }
  .goods-detail {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}

.centent {
  display: flex;
  justify-content: space-between;
  & > div {
    width: 210px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #eee;
    border-radius: 5px;
    text-align: center;
    padding: 10px;

    .title {
      text-align: center;
      padding: 10px 0;
    }
    .link {
      height: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn-box {
      margin-top: 10px;
      text-align: center;
    }
    .qr-img {
      margin-bottom: 10px;
      width: 180px;
      height: 180px;
      line-height: 180px;
      text-align: center;
      color: #f5f7fa;
      font-size: 24px;
      background-color: #c0c4cc;
    }
  }
}

.footer {
  text-align: center;
  margin-top: 15px;
}

.poster-box {
  position: absolute;
  right: 500px;
}

.poster {
  background-color: #fff;
  border-radius: 5px;
  width: 240px;

  .poster-title {
    font-weight: bold;
    font-size: 16px;
    padding: 10px 0;
  }
  .poster-tip {
    color: #aaa;
    padding-bottom: 10px;
  }
  .goods-img {
    margin-bottom: 10px;
    width: 180px;
    height: 180px;
    line-height: 180px;
    text-align: center;
    color: #f5f7fa;
    font-size: 24px;
    background-color: #c0c4cc;
  }

  .desc {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    .goodsname {
      text-align: left;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      max-width: 135px;
    }
    .price {
      margin-left: 5px;
      white-space: nowrap;
      color: red;
      font-size: 22px;
      width: 50%;
    }
  }

  .poster-footer {
    display: flex;
    padding: 10px;
    text-align: left;
    font-size: 12px;
    color: #aaa;
    .qr-box {
      margin-right: 10px;
      height: 50px;
      .qr-img {
        margin-bottom: 10px;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #f5f7fa;
        font-size: 24px;
        background-color: #c0c4cc;
      }
    }
    &-tips {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}
</style>
