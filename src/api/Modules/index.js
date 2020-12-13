import {axiosK,axiosG,axiosD, } from '@/api/axios'

export const visitApi = data => axiosG('/', data) //登记

export const loginApi = data => axiosK('/user/login', data) //登录
export const logoutApi = data => axiosD('/user/logout', data) //退出登录
export const userInfoApi = data => axiosG('/user/info', data) //拉取用户信息
export const initMenuApi = data => axiosG('/user/initMenu', data) //获取菜单更新权限



