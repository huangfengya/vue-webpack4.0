## 需要用到的 loader 和 plguins

### loader

#### 1. vue-loader vue-template-compiler

vue-loader v15 改版，css 转换不再内联;需要在 plugin 中引用 **vue-loader/lib/plugin**

```javascript
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  ...
  plugins: [
    ...
    new VueLoaderPlugin(),
  ]
}
```

options:

transformAssetUrls: 将所有遇到的资源 URL 转换为 require 请求，video、source、img、image、use 的资源地址默认被转换。原因：可以就近管理图片文件，可以使用相对路径而不用担心部署时 URL 的问题。使用正确的配置，webpack 将会在打包输出中自动重写文件路径为正确的 URL。

#### 2. babel-loader js 转换

options:

  presets: 将js转换的版本，注意，babel v7 版本以后只有 presets-env, 各种 stage-0/stage-1 等都被废弃
  plugin: 插件，比如 @babel/polyfill, @babel/transform-runtime

##### @babel/polyfill 和 @babel/transform-runtime 区别

两者都是用来做 js 转换的，如 es6 转 es5 或更低版本

@babel/polyfill

会改写全局的 prototype 属性，可以使用各种实例化后的新方法，如 Array.prototype.includes()，可以使用 Promise/map/Set 等新语法；缺点是会增大代码打包后的体积，污染全局变量。推荐在各种独立项目中使用。

@babel/transform-runtime

不会改写全局的 prototype 属性，所以各种实例后的方法无法使用，如 Array.prototype.includes()，但是不会影响 Promise/map/Set 等新定义的语法的使用，而且依赖会按需引入，减小包体积；缺点是各种新的实例化后的方法无法使用。推荐在插件开发时使用。

> 使用 transform-runtime 需要依赖两个包：@babel/runtime  @babel/plugin-transform-runtime


#### 3. url-loader vs file-loader 字体/图片转换

都是应用于资源处理(图片、视频、音频等)。

##### file-loader

用于资源路径的修改，由于开发环境和线上环境的路径问题，可能会导致资源 404，file-loader 可以修改资源的打包路径，并修改代码中的资源地址，使其与资源路径对应

##### url-loader

可以将较小的资源编码成 dataURL 并打包进代码，用于减少 http 请求，通过参数 limit 进行对不同大小的资源进行处理，而且 url-loader 内部封装了 file-loader，但是 file-loader 包还是要下载的……

> 打包后的资源路径：output.publicPath + url-loader.publicPath + output.path + url-loader.outputPath + url-loader.name

#### 4. css-loader / less-loader ... css及css预编译 转换
#### 5. postcss-loader   css 补全

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')(...config), // 补全css前缀
    require('postcss-plugin-px2rem')(...config) // px转rem
  ]
}
```

### plguins
1. webpack.DefinePlugin

用于配置环境，用于开发环境与线上环境的不同值的配置。需要注意的是这个插件是直接替换，需要将其用引号括起来（字符串也得在加个单引号），否则在被替换的位置会被当成变量而非字符串，使用 JSON.stringify 转换也可以

2. html-webpack-plugin

```javascript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      fileName: 'index.html',  // 输出的文件名 路径是 output.path + fileName
      template: 'public/index.html', // 引入的文件 相对于根路径
      inject: true,  // 文件的插入位置，默认为 body 底部
      minify: {...config} // 压缩文件的配置
      chunks: ['index', 'main']  // 用于多入口文件打包
    })
  ]
}
```

3. mini-css-extract-plugin

css 提取成单独文件，而且由于目前这个插件还不支持 HRM(热替换)，所以只能在线上环境使用

注意：mini-css-extract-plugin 和各类style-loader 冲突，同时存在的话，会报 document is not defined 错误

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',  // 路径为 output.publicpath + output.path + filename
      chunkFilename: '[id].css'
    })
  ]
}
```

4. splitChunks 提取公共代码

webpack4 自带js公共代码提取

```javascript
module.exports = {
  ...
  optimization: {
    splitChunks: {
      chunks: 'all', //默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
      name: 'vendor', // 命名
      minSize: 3000, // 小于该值的代码不会被压缩
      minChunks: 1, // 至少被引用的次数，小于此值不会被提取
      maxInitialRequests: 3,  // 入口文件的最大分包数，和 http 最大请求数有关，不建议修改
      maxAsyncRequests: 5,  // 按需加载时最大的并行数，不建议修改
      cacheGroups: {
        vendors: {  // 主要用于对第三方模块的引用
          test: /\/node_modules\//,
          minChunks: 1,
          priority: -10,  // 更高的优先级
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 允许代码复用
        }
      }
    }
  }
}
```

5. uglifyjs-webpack-plguin js 压缩

webpack4 之前是在 webpack.optimize.CommonsChunkPlugin 中压缩 js，webpack4 版本之后在 optimization.minimizer 中配置。注意：当配置 sourceMap: 'cheap-souce-map' 选项时不适用于此插件

```javascript
module.exports = {
  optimization: [
    minimizer: {
      new UglifyjsWebpackPlugin({
        test: /\.js(\?.*)?$/, // 匹配要压缩的文件
        include: /\/includes/,  // 包含哪些文件
        exclude: /\/excludes/,  // 不包含哪些文件
        cache: false, // 缓存
        parallel: true, // 使用多线程并行运行来提高构建速度
      })
    }
  ]
}
```

6. optimize-css-assets-webpack-plugin css 压缩

css 压缩软件

```javascript
module.exports = {
  optimization: {
    minimizer: [
      new OptimuzeCssPlugin({
        assetNameRegExp: /\.css$/g, // 要压缩的文件，默认为 /\.css$/g
        cssProcessor: require('cssnano'), // 处理方法，默认为 cssnano，不用自己重新引入 cssnano
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true,  // 移除注释
          }
        },
      })
    ]
  }
}
```

7. clean-webpack-plugin 清理文件夹

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

8. friendly-errors-webpack-plugin  node-notifier

friendly-errors-webpack-plugin 用于对打包信息的提取，而不是所有打包信息都输出
node-notifier 桌面提醒

```javascript
module.exports = {
  devServer: {
    quiet: true,  // 开启安静打包
  },
  plugins: [
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        message: ['http://localhost:8848'],  // 打包成功显示的信息
      },
      onErrors: (severity, errors) => { // 错误会直接打印
        require('node-notifier')({  // 桌面报错提示
          title: "Webpack error", // 报错标题
          message: severity + ': ' + error.name,  // 报错信息
          subtitle: error.file || '', // 错误位置
          // icon: ICON // 图标
        })
      }
    })
  ]
}
```

9. webpack-merge

用于对 webpack 配置文件的配置合并

10. portfinder

获取端口……感觉没大大用途
