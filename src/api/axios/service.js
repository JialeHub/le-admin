import axios from 'axios'
import router from '@/router'
import store from '@/store'
import settings from '@/settings'

const service = axios.create({
  timeout: settings.timeout,
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true
})

// 请求拦截
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    const url = config.url
    if (!notAddToken(url)) config.headers.Authorization = token
    return config
  },
  error => {
    return Promise.reject(error.response)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { status } = error.response.data
    if (status === 404) {
      router.push({ name: 'error404' }).then()
    } else if (status === 403) {
      router.push({ name: 'error403' }).then()
    } else if (status === 401) {
      store.dispatch('setExpireLogin',true).then()
    }
    return Promise.reject(error.response)
  }
)

/**
 * @description 白名单，不添加token的接口
 * */
const notAddToken = (url) =>[
  'login'
].some(item => url === item)

export default service
