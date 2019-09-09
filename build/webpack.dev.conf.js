const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const merge = require("webpack-merge")
const FirendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const portfinder = require('portfinder')
const baseWebpackConfig = require("./webpack.base.conf")
const utils = require('./utils')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      usePostCSS: true,
      extract: false // 貌似不支持热更新，测试环境就关了吧
    })
  },

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    host: true,
    contentBase: path.resolve(__dirname, '../dist'), // 用户告诉服务器 index.html 位置
    compress: true, // 是否开启压缩
    host: HOST || '0.0.0.0',
    port: PORT || "8848",
    proxy: {},
    quiet: true // 静默打包，同时需要开启 friendly-errors-webpack-plugin 来查看错误
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // 因为这个插件是直接替换，如果不用引号括起来，在被替换的位置会被当成 development 变量而非字符串，使用 JSON.stringify 转换也可以
        NODE_ENV: '"development"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.NamedModulesPlugin(), // 热更新时直接返回更新文件名，而不是文件的id
    // 多页面配置
    new HtmlWebpackPlugin({
      filename: 'index.html', // 相对于根路径
      template: 'index.html', // 相对于 output.path
      inject: true
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || "8848"
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      devWebpackConfig.plugins.push(
        new FirendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`打包成功: 查看地址是啥呢`]
          },
          onErrors: utils.createNotifierCallback()
        })
      )
      resolve(devWebpackConfig)
    }
  })
})