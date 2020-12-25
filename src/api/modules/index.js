import {axiosK, axiosG, axiosD, axiosF,axiosP} from '@/api/axios'

export const visitApi = data => axiosG('/', data) //登记

export const loginApi = data => axiosK('/user/login', data) //登录
export const logoutApi = data => axiosD('/user/logout', data) //退出登录
export const getUserInfoApi = data => axiosG('/user/info', data) //拉取用户信息
export const initMenuApi = data => axiosG('/user/initMenu', data) //获取菜单更新权限

export const getUserListApi = data => axiosG('/user/list', data) //获取用户列表
export const updateUserApi = (id,data) => axiosP('/user/update/'+id, data) //修改用户信息

export const getPublishApi = data => axiosG('/publish', data) //test
export const postPublishApi = data => axiosK('/publish', data) //test
export const updatePublishApi = (id,data) => axiosP('/publish/update/'+id,data) //test
export const delPublishApi = id => axiosD('/publish/delete/'+id) //test
export const uploadApi = data => axiosF('/file', data) //test

