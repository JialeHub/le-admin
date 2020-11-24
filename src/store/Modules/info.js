const type = {
  SET_REMEMBER_ME: 'SET_REMEMBER_ME',
  SET_EXPIRE_LOGIN: 'SET_EXPIRELOGIN',
};

const state = {
  username: '',
  rememberMe: false,
  expireLogin: false,
};

const getters = {
  username: state => state.username,
  rememberMe: state => state.rememberMe,
  expireLogin: state => state.expireLogin
};

const mutations = {
  [type.SET_REMEMBER_ME](state, info) {
    state.rememberMe = info.rememberMe;
    if (state.rememberMe) state.username = info.username;
    else state.username = ''
  },
  [type.SET_EXPIRE_LOGIN](state, expireLogin) {
    state.expireLogin = expireLogin;
  },
};

const actions = {
  setRememberMe: ({commit}, info) => {
    commit(type.SET_REMEMBER_ME, info)
  },
  setExpireLogin: ({commit}, expireLogin) => {
    commit(type.SET_EXPIRE_LOGIN, expireLogin)
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}

