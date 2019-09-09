const path = require("path")
// vue-loader v15 版本更新
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const utils = require("./utils")

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash:8].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      "vue$": 'vue/dist/vue.esm.js',
      "@": resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
        options: {
          // 模块编译的过程中，是否将某些属性转为require调用
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: 'url-loader',
        options: {
          limit: 10000,
          name: "static/img/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: "static/media/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: "static/font/[name].[hash:7].[ext]"
        }
      }
    ]
  },
  plugins: [
    // vue-loader v15 版本更新，必须要加
    new VueLoaderPlugin()
  ]
}