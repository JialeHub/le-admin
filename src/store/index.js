import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Cookies from "js-cookie";
import settings from '@/settings'
import {deepClone, tryJSONParse, tryReadUnknown} from '@/utils/globalMethod'

Vue.use(Vuex)

// 自动获取modules下的*.js
const modulesFiles = require.context("./Modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const cloneModules = deepClone(modules);

const plugins = navigator.cookieEnabled?[
  createPersistedState({
    key: `${settings.prefix}-INFO`,
    storage: window.localStorage,
    reducer: val => ({info: val.info}),
  }),
  createPersistedState({
    key: `${settings.prefix}-TOKEN`,
    storage: {
      getItem: key => Cookies.get(key),
      setItem: (key, value) =>
        Cookies.set(key, value, {expires: tryReadUnknown(tryJSONParse(window.localStorage.getItem(`${settings.prefix}-INFO`)),".info.rememberMe") ? settings.tokenCookieExpires : 1}),
      removeItem: key => Cookies.remove(key)
    },
    reducer: val => ({token: val.token})
  })
]:[]

const store = new Vuex.Store({
  modules,
  plugins
})

// 重置vuex
export const resetStore = () => {
  for (let module in store.state) {
    if (['info', 'settings'].includes(module)) continue
    for (let key in store.state[module])
      store.state[module][key] = deepClone(cloneModules[module].state[key])
  }
}

export default store
