module.exports = {
  /**
   * @description 网站设置
   * */
  // 网站标题
  title: 'LE后台管理系统',
  // 菜单标题
  menuTitle: '老撾韻達 - 后台管理',
  // 底部文字
  footerTxt: '',
  // 备案号
  caseNumber: '',

  /**
   * @description 系统设置
   * */
  // store's key的前缀
  prefix: 'V',
  // 是否开启验证码
  hasCode: true,
  // 记住密码时token的存储时间(天)
  tokenCookieExpires: 14,
  // 请求超时时间(s)
  timeout: 5 * 60 * 1000,
  // 是否启用history
  isHistory: true,
  // 分页条数设置
  pagingSize: 10,
  // 货币设置
  isRMB: false,

  /**
   * @description 样式设置
   * */
  // 是否固定头部
  isFixHeader: true,
  // 是否显示logo
  isShowLogo: true,
  // 是否显示标签
  isShowTag: true,
  // 是否显示面包屑
  isShowBreadcrumb: true,
  // 是否显示设置的底部信息
  isShowFooter: false,
  // 菜单是否夜晚模式
  isNight: true,
  // 菜单是否垂直
  isVertical: true,
  // 是否只保持一个子菜单的展开
  isUniqueOpened: true,
  // 组件大小设置
  layoutSize: "small"
};
