## 需要用到的 loader 和 plguins

### loader

1. vue-loader

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

2. babel-loader js 转换
3. url-loader 字体/图片转换
4. css-loader / less-loader ... css及css预编译 转换
5. postcss-loader   css 补全

### plguins

1. html-webpack-plugin
2. webpack-merge
3. friendly-errors-webpack-plugin
4. portfinder
5. mini-css-extract-plugin
6. optimize-css-assets-webpack-plugin

### 其他

1. splitChunks 提取公共代码

webpack4 自带js公共代码提取

```javascript
module.exports = {
  ...
  optimization: {
    splitChunks: {
      ...
    }
  }
}
```

2. js 代码压缩

webpack4 在 "production" 环境下会自动压缩

3. compression-webpack-plugin css 压缩

### 错误处理

1. node-notifier 报错提醒