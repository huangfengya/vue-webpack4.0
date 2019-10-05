const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const merge = require("webpack-merge")
const MiniCssWebpackPlugin = require("mini-css-extract-plugin")
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const uglifyjsWebpackPlguin = require('uglifyjs-webpack-plugin')
const baseWebpackConfig = require("./webpack.base.conf")
const utils = require('./utils')
const config = require('./config')

const webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  devtool: false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.sourceMap,
      usePostCSS: config.build.postCss,
      extract: config.build.extract,
    })
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].js'
  },
  optimization: {
    minimizer: [
      new OptimizeCssPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true,
          }
        },
      }),
      new uglifyjsWebpackPlguin({
        test: /\.js(\?.*)?$/,
        exclude: /node_modules/,
        cache: false,
        parallel: true,
      })
    ],
    splitChunks: {
      chunks: 'all', //默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
      minSize: 30, // 小于该值的代码不会被压缩
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {  // 主要用于对第三方模块的引用
          name: 'vendors',
          test: /node_modules/,
          minChunks: 1,
          priority: -10
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 允许代码复用
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env,
    }),
  ]
})

for (let val of config.build.mutileHtml) {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      minify: {
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 合并多余空格
        removeAttributeQuotes: true, // 如果HTML允许，去除属性的引号
      },
      chunksSortMode: 'dependency',  // 顺序引入 js
      ...val,
    })
  )
}

// 是否提取 css
if (config.build.extract) {
  webpackConfig.plugins.push(
    new MiniCssWebpackPlugin({
      filename: "static/css/style.css",
      chunkFilename: "static/css/[name].css"
    })
  )
}

// 是否开启gzip压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(`\.(${config.build.productionGzipExtensions.join('|')})$`),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig