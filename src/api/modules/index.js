import {axiosK, axiosG, axiosD, axiosDs, axiosF,axiosP} from '@/api/axios'

export const visitApi = data => axiosG('/', data) //登记

export const loginApi = data => axiosK('/user/login', data) //登录
export const logoutApi = data => axiosD('/user/logout', data) //退出登录
export const getUserInfoApi = data => axiosG('/user/info', data) //拉取用户信息
export const initMenuApi = data => axiosG('/user/initMenu', data) //获取菜单更新权限

export const getUserListApi = data => axiosG('/user/list', data) //获取用户列表
export const updateUserApi = (id,data) => axiosP('/user/update/'+id, data) //修改用户信息

export const postPublishApi = data => axiosK('/publish', data) //发布(测试)
export const uploadApi = data => axiosF('/file', data) //上传文件(测试)
export const collectMeApi = data => axiosG('/publish/collectMe', data) //获取自己的分数(测试)

export const getPublishApi = data => axiosG('/publish', data) //获取记录
export const updatePublishApi = (id,data) => axiosP('/publish/update/'+id,data) //评分
export const delPublishApi = id => axiosD('/publish/delete/'+id) //删除指定记录
export const delPublishsApi = data => axiosDs('/publish/delete',data) //批量删除记录
export const downloadFileApi = id => axiosG('/publish/downloadFiles/'+id) //下载指定记录图片
export const downloadFilesApi = data => axiosK('/publish/downloadFiles',data) //下载批量记录图片
export const getCollectApi = data => axiosG('/publish/collect',data) //汇总用户分数
export const collectExportApi = data => axiosG('/publish/collectExport',data) //汇总用户分数
export const dataExportApi = data => axiosG('/publish/dataExport',data) //导出记录数据

