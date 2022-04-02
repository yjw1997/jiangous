// baseUrl: "http://192.168.0.236:16880", //  光南环境地址
// baseUrl: "http://192.168.0.236:16880", //  李静环境地址
// baseUrl: "http://192.168.0.18:16883", //  郭建环境地址
// baseUrl: "http://192.168.0.182", //  同华环境地址
// baseUrl: "http://192.168.0.126", //  海健环境地址
// baseUrl: "http://192.168.0.196", //  志明环境地址
// baseUrl: "http://192.168.0.149", //  鸿鹏环境地址

// baseUrl: "http://192.168.0.143:51000", // 测试地址
// baseUrl: "http://fat-gateway.us168168.com/", // fat地址
const baseUrl = "http://fat-gateway.us168168.com/"
console.log('%c [ process.env.NODE_ENV ]', 'font-size:13px; background:pink; color:#bf2c9f;', process.env)
module.exports = {
  baseUrl: process.env.NODE_ENV === 'development' ?
    'http://fat-gateway.us168168.com/' : process.env.VUE_APP_BASE_API,
  isAse: false,
  version: '',
  identification: '/admin',
  merchantIdentification: '/business',
  applicationName: 'jiangou-admin',
  other: '/wf-jiangou-other-service',
  order: '/wf-jiangou-order-service',
  goods: '/ wf-jiangou-goods-service',
  auth: '/wf-authorization-center-service',
  activity: '/wf-jiangou-activity-service',
  userCenter: '/wf-jiangou-user-service',
  // 解密加密需要的key 和Iv
  devAesKey: '1234567887654321',
  devAesIv: '1234567887654321',

  proAesIv: '1234567887654321',
  proAesKey: '1234567887654321',
  smsTemplateCode: 'Q5KjUMX0jUjzrTs3', //全局验证码code

  minioConfig: {
    endPoint: process.env.NODE_ENV === 'development' ? '192.168.0.143' : process.env.VUE_APP_MINIO_URL, //对象存储服务的URL
    port: process.env.NODE_ENV === 'development' ? 30150 : Number(process.env.VUE_APP_MINIO_PROT) !== 0 ? Number(process.env.VUE_APP_MINIO_PROT) : '', //端口号
    useSSL: process.env.NODE_ENV === 'production' ? true : false, //true代表使用HTTPS
    'access-key': 'admin',
    'secret-key': 'wanfu!@#',
    bucketName: process.env.NODE_ENV === 'development' ? 'dev-jiangou' : process.env.VUE_APP_MINIO_bucketName,
  },
  WINDOW_CONFIG_UPLOAD_Image: function () {
    return this.baseUrl + this.auth + this.version + '/file/upload'
  }, // 上传图片接口,七牛图片服务器接口
  WINDOW_CONFIG_IMAGE: 'https://images.us168168.com/', // 七牛图片前缀
}