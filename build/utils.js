const path = require("path")
const MiniCssWebpackPlugin = require("mini-css-extract-plugin")

exports.cssLoader = function(options) {
  options = options || {}

  const vueStyleLoader = {
    loader: 'vue-style-loader'
  }

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // 工厂函数，用于多种 css loader 生成，好机智
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [vueStyleLoader, cssLoader, postcssLoader] : [vueStyleLoader, cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: {
          ...loaderOptions,
          sourceMap: options.sourceMap
        }
      })
    }

    if (options.extract) {
      // MiniCssWebpackPlugin 和 style-loader 不兼容，需要提取出来
      loaders.shift()
      loaders.unshift(MiniCssWebpackPlugin.loader)
    }
    return loaders
  }
  // 缺啥自己加
  return {
    css: generateLoaders(),
    less: generateLoaders('less')
  }
}

// 独立的 css 文件解析
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoader(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// 错误处理
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split("!").pop()

    notifier.notify({
      title: '小伙子, 文件报错啦~',
      message: severity + ": " + error.name,
      subtitle: filename || '',
      icon: ''
    })
  }
}

exports.netWorkIp = () => {
  try {
    let netWork = require("os").networkInterfaces()
    for (let key in netWork) {
      let lo = netWork[key]
      for (let k of lo) {
        if (k.family === 'IPv4' &&
            k.address !== '127.0.0.1' &&
            !k.internal)
          return k.address
      }
    }
  } catch(e) {
    return null
  }
}