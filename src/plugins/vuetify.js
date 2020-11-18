import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHans from 'vuetify/es5/locale/zh-Hans';

Vue.use(Vuetify);

Vuetify.config.silent = true

export default new Vuetify({
  theme: {
    disable: false,
    options: {
      customProperties: false,
    },
    themes: {
      light: {
        primary: '#0072AC',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#DC3232',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
  lang: {
    locales: {zhHans},
    current: 'zh-Hans',
  },
});