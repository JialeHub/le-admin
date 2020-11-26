import {axiosK,axiosG} from '@/api/axios'

export const visitApi = data => axiosG('/', data) //登记

export const loginApi = data => axiosK('login', data) //登录




