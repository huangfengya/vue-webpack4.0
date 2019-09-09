const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const merge = require("webpack-merge")
const MiniCssWebpackPlugin = require("mini-css-extract-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const baseWebpackConfig = require("./webpack.base.conf")
const utils = require('./utils')
const config = require('./config')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: config.build.extract,
      userPostCSS: true
    })
  },

  devtool: false,
  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        return (
          chunk.resource &&
          /\.js$/.test(module.resource) &&
          chunk.resource.indexOf(
            path.join(__dirname, "../node_modules")
          ) === 0
        )
      },
      children: true,
      minChunks: 3,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 合并多余空格
        removeAttributeQuotes: true, // 如果HTML允许，去除属性的引号
      },
      chunksSortMode: 'dependency'  // 顺序引入 js
    })
  ]
})

// 是否提取 css
if (config.build.extract) {
  webpackConfig.plugins.push(
    new MiniCssWebpackPlugin({
      filename: "css/style.css",
      chunkFilename: "[id].css"
    })
  )
}

// 是否开启gzip压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(`\.(${config.build.productionGzipExtensions.join('|')})$`),
      threshold: 10240,
      mainRatio: 0.8
    })
  )
}

module.exports = webpackConfig