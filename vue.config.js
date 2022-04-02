'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const { identification, merchantIdentification } = require('./src/utils/config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'jianshops' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 8888 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
const aa = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: true,
      errors: true
    },

    // //  把url拉出来单独拦截
    proxy: {
      // '/auth/password': {
      //   target: 'http://192.168.0.250:7300/mock/6142dc3c2624a219c8864016/jiangous', //服务器api地址
      //   changeOrigin: true, //是否跨域

      // },
      // '/appUser/getMenusByRole': {
      //   target: 'http://192.168.0.250:7300/mock/6142dc3c2624a219c8864016/jiangous', //服务器api地址
      //   changeOrigin: true, //是否跨域
      //   pathRewrite: { //重写路径
      //     // ['^' + process.env.VUE_APP_BASE_API]: ''
      //   }
      // },
      '/auth/password': {
        target: 'http://dev-gateway.us168168.com', //服务器api地址
        changeOrigin: true, //是否跨域
        pathRewrite: { //重写路径
          '/post': ''
        }
      },
      '/appUser/getMenusByRole': {
        target: 'http://dev-gateway.us168168.com', //服务器api地址
        changeOrigin: true, //是否跨域
      },
      // '/wf-authorization-center-service': {
      //   target: 'http://dev-gateway.us168168.com', //服务器api地址
      //   changeOrigin: true, //是否跨域
      //   pathRewrite: { //重写路径
      //     '/wf-authorization-center-service': ''
      //   }
      // },
      // '/ wf-jiangou-goods-service': {
      //   target: 'http://192.168.0.240:8782', //服务器api地址
      //   changeOrigin: true, //是否跨域
      //   pathRewrite: { //重写路径
      //     '/ wf-jiangou-goods-service': ''
      //   }
      // },

      '/wf-jiangou-order-service': {
        target: 'http://192.168.0.196:8781', //服务器api地址
        changeOrigin: true, //是否跨域
        pathRewrite: { //重写路径
          '/wf-jiangou-order-service': ''
        }
      },
      '/wf-jiangou-user-service': {
        target: 'http://192.168.0.196:8780', //服务器api地址
        changeOrigin: true, //是否跨域
        pathRewrite: { //重写路径
          '/wf-jiangou-user-service': ''
        }
      },
      // '/wf-jiangou-activity-service': {
      //   target: 'http://192.168.0.240:8785', //服务器api地址
      //   changeOrigin: true, //是否跨域
      //   pathRewrite: { //重写路径
      //     '/wf-jiangou-activity-service': ''
      //   }
      // },
      '/wf-jiangou-other-service': {
        target: 'http://192.168.0.21:8783', //服务器api地址
        changeOrigin: true, //是否跨域
        pathRewrite: { //重写路径
          '/wf-jiangou-other-service': ''
        }
      },
      [merchantIdentification]: {
        target: 'http://dev-gateway.us168168.com', //服务器api地址
        changeOrigin: true, //是否跨域
      },
      [identification]: {
        target: 'http://dev-gateway.us168168.com', //服务器api地址
        changeOrigin: true, //是否跨域
      },
      // },
    }

  },
  configureWebpack: () => {
    const _config = {
      name: name,
      resolve: {
        alias: {
          '@': resolve('src')
        }
      },

      plugins: [],
    }
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.


    // plugins: [
    //   //  添加gzip压缩
    // ]
    return _config

  },
  chainWebpack (config) {






    //  清除conosle
    config.optimization.minimizer("terser").tap((args) => {
      const compress = args[0].terserOptions.compress;
      compress.drop_console = true;
      compress.pure_funcs = [
        "__f__", // App 平台 vue 移除日志代码
      ];
      return args;
    });
    // 可以提高第一屏的速度，建议开启预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 空闲时间预加载,当页面太多时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {

          config.plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}

module.exports = aa
