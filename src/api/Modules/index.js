import {axiosK,axiosH} from '@/api/axios'

export const visitApi = data => axiosH('/', data) //登记

export const loginApi = data => axiosK('login', data) //登录




