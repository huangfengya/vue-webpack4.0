module.exports = {
  // 开发环境配置
  dev: {
    // 环境配置
    NODE_ENV: "development",
    
    // 本地服务器配置
    host: "localhost",
    port: "8848",
    autoOpen: false,
    proxy: {
    }
  },

  // 生产环境配置
  build: {
    // 环境配置
    NODE_ENV: "production",

    // 是否 css 提取
    extract: true,

    // 是否开启 gzip 压缩
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  }
}