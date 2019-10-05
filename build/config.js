module.exports = {
  // 通用配置
  common: {
    // css 预处理器
    cssPreProcess: ['less'],
    entry: {
      index: './src/main.js',
    },
  },

  // 开发环境配置
  dev: {
    // 环境配置
    env: {
      // 因为这个插件是直接替换，如果不用引号括起来，在被替换的位置会被当成 development 变量而非字符串，使用 JSON.stringify 转换也可以
      NODE_ENV: '"development"',
    },

    // 多文件配置
    mutileHtml: [
      {
        filename: 'index.html', // 要输出的文件名
        template: 'public/index.html', // 使用哪个模板
        chunks: ['index']
        // htmlwebpack 中的其他参数，用于 filename 中配置
      }
    ],

    extract: false,  // 是否 css 提取, 开启后 hrm 不支持，开发环境不推荐打开
    sourceMap: true,  // css sourceMap
    postCss: true, // css 补全
    
    // 本地服务器配置
    port: "8848",
    autoOpen: true,
    proxy: {}
  },

  // 生产环境配置
  build: {
    // 环境配置
    env: {
      NODE_ENV: '"production"',
    },

    // 多文件配置
    // 文件压缩已配置，这儿如果再写 minify 属性，会覆盖
    mutileHtml: [
      {
        filename: 'index.html',
        template: 'public/index.html',
        chunks: ['index', 'common', 'vendors']
      }
    ],

    extract: true,
    sourceMap: false,
    postCss: true,

    // 是否开启 gzip 压缩
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  }
}