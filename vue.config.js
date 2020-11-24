const settings = require("./src/settings");

module.exports = {
  publicPath: settings.isHistory ? "/" : "./",
  "transpileDependencies": [
    "vuetify"
  ],
  /*css: {
    loaderOptions: {
      scss: {
        prependData:
          '@import "@/styles/variables.scss";'+
          '@import "@/styles/reset.scss";'+
          '@import "@/styles/index.scss";'+
          '@import "@/styles/common.scss";'
      }
    },
    extract: false
  },*/
  module: {
    rules: [
      // SASS与SCSS相比有不同的行尾
      // 并且不能在标记中使用分号
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // 需要 sass-loader@^9.0.0
            options: {
              // 这是您的变量文件的路径
              additionalData: "@import '@/styles/variables.scss'"
            },
          },
        ],
      },
      // SCSS与SASS相比有不同的行尾
      // 并且在import后面需要分号
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // 需要 sass-loader@^9.0.0
            options: {
              // 这是您的变量文件的路径
              additionalData: "@import '@/styles/variables.scss';"
            },
          },
        ],
      },
    ],
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= settings.title
        return args
      })
  },
  devServer: {
    "disableHostCheck" : true,
    proxy: {
      '/devApi/': {
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
        pathRewrite: {
          '^/devApi/': ''
        }
      },
      '/prodApi/': {
        target: 'http://49.235.110.8:8000/',
        changeOrigin: true,
        pathRewrite: {
          '^/prodApi/': ''
        }
      }
    }
  },
  runtimeCompiler: true
}
