module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
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
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= 'LE后台管理系统'
        return args
      })
  },
  devServer: {
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
