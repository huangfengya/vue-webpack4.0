const path = require("path")
const MiniCssWebpackPlugin = require("mini-css-extract-plugin")

exports.cssLoader = function(options) {
  options = options || {}

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
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: {
          ...loaderOptions,
          sourceMap: options.sourceMap
        }
      })
    }

    let exportLoader = ['vue-style-loader', ...loaders]
    return options.extract ? exportLoader.unshift(MiniCssWebpackPlugin.loader) : exportLoader
  }
  // 缺啥自己加
  return {
    css: generateLoaders(),
    less: generateLoaders('less'),
    scss: generateLoaders('sass')
  }
}

// 独立的 css 文件解析
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoader(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + $),
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