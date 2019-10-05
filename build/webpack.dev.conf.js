const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const merge = require("webpack-merge")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const baseWebpackConfig = require("./webpack.base.conf")
const utils = require('./utils')
const config = require('./config')

const HOST = utils.netWorkIp()

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.sourceMap,
      usePostCSS: config.dev.postCss,
      extract: config.dev.extract,
    })
  },
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, '../dist'), // 用户告诉服务器 index.html 位置
    compress: true, // 是否开启压缩
    host: HOST,
    port: config.dev.port,
    open: config.dev.autoOpen,
    proxy: config.dev.proxy,
    quiet: true // 静默打包，同时需要开启 friendly-errors-webpack-plugin 来查看错误
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.NamedModulesPlugin(), // 热更新时直接返回更新文件名，而不是文件的id
  ]
})

// 多页面配置
for (let val of config.dev.mutileHtml) {
  devWebpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      ...val,
    })
  )
}

module.exports = new Promise((resolve, reject) => {
  devWebpackConfig.plugins.push(
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`地址: http://${HOST}:${config.dev.port}`]
      },
      onErrors: utils.createNotifierCallback()
    })
  )
  resolve(devWebpackConfig)
})