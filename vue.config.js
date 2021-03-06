const settings = require("./src/settings");

module.exports = {
  assetsDir: 'assets',
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "~@/styles/variables.scss"'
      },
      scss: {
        additionalData: '@import "~@/styles/variables.scss";'
      }
    }
  },
  pages: {
    index: {
      entry: './src/main.js',
      title: settings.title
    }
  },
  devServer: {
    "disableHostCheck": true,
    proxy: {
      '/devApi/': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        pathRewrite: {
          '^/devApi/': ''
        }
      },
      '/prodApi/': {
        target: 'http://121.196.153.82:8080/',
        changeOrigin: true,
        pathRewrite: {
          '^/prodApi/': ''
        }
      }
    }
  },
  productionSourceMap: false,

}
