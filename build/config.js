module.exports = {
  // 开发环境配置
  dev: {

  },

  // 生产环境配置
  build: {

    // 是否 css 提取
    extract: true,

    // 是否开启 gzip 压缩
    productionGzip: true,
    productionGzipExtensions: ['js', 'css']
  }
}