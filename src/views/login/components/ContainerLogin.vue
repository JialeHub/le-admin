<template>
  <v-container fluid class="loginContainer">
    <!--Logo-->
    <v-row no-gutters class="loginRow" justify="center">
      <h1>
        <router-link to="/login" class="logoLink">LE后台管理系统</router-link>
      </h1>
    </v-row>
    <!--提示框-->
    <v-row no-gutters v-if="$notEmpty(alertObj)">
      <v-alert :type="alertObj.type" border="left" colored-border :color="`${alertObj.color} accent-4`"
               class="alertSheet w100" transition="slide-y-transition" v-model="alertFlag"
               :dismissible="alertObj.closeIcon!==false">
        <div v-for="(item,index) in alertObj.msg" :key="index">
          <strong v-if="$notEmpty(item.strong)">{{item.strong}}</strong>
          <span v-if="$notEmpty(item.text)">{{item.text}}</span>
          <router-link :to="item.link" class="underLink link0" v-if="$notEmpty(item.linkText)">{{item.linkText}}</router-link>
        </div>
      </v-alert>
    </v-row>
    <!--登录框-->
    <v-row no-gutters>
      <v-sheet class="loginSheet w100" elevation="2">
        <v-form ref="loginForm" v-model="formRules.formValid" :lazy-validation="true">
          <v-text-field v-model="form.username" label="用户名或电子邮件地址" required error-count="0" ref="username"
                        @keyup.enter.native="passFocus"
                        :rules="formRules.usernameRules"></v-text-field>
          <v-text-field v-model="form.password" label="密码" required :rules="formRules.passRules" error-count="0"
                        :type="form.showPass ? 'text' : 'password'" ref="password"
                        :append-icon="form.showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="form.showPass = !form.showPass"
                        @keyup.enter.native="submit"
          ></v-text-field>
          <v-row no-gutters justify="space-between" align="center">
            <v-checkbox v-model="form.rememberMe" label="记住我的登录信息" :ripple="false"
                        :disabled="!cookieEnabled"></v-checkbox>
            <v-btn depressed color="primary" @click="submit" :loading="loginLoading">登录</v-btn>
          </v-row>
        </v-form>
      </v-sheet>
    </v-row>
    <!--其他链接-->
    <v-row no-gutters>
      <div class="navDiv" v-if="false">
        <p class="nav">
          <router-link to="/forget" class="otherLink link1">忘记密码？</router-link>
        </p>
        <p class="nav">
          <router-link to="/" class="otherLink link2">← 返回站点</router-link>
        </p>
      </div>
    </v-row>
  </v-container>
</template>

<script>

  import Cookies from "js-cookie"
  import settings from "@/settings";
  import {login} from "@/utils/auth";
  import {notEmpty} from "@/utils/globalMethod";

  export default {
    name: 'ContainerLogin',
    data() {
      return {
        redirect: undefined,
        otherQuery: {},
        alertObj: {},
        cookieEnabled: true,
        alertFlag: false,
        loginLoading: false,
        formRules: {
          autoValid: true,
          formValid: true,
          usernameRules: [v => this.formRules.autoValid || !!v || '用户名不能为空。'],
          passRules: [v => this.formRules.autoValid || !!v || '密码不能为空。'],
        },
        form: {
          username: '',
          password: '',

          rememberMe: false,
          showPass: false
        }
      };
    },
    mounted() {
      this.form.username = this.$storeGet.username;
      this.form.rememberMe = this.$storeGet.rememberMe;
      if (this.form.username === '') {
        this.$refs.username.focus()
      } else if (this.form.password === '') {
        this.$refs.password.focus()
      }
      this.init();
    },
    props: {
      comStatus: { // 组件状态
        type: String,
        default: ''
      },
    },
    beforeDestroy() {
      this.$emit('close-login-dialog')
    },
    methods: {
      passFocus() {
        this.$refs.password.focus()
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
      init() {
        Cookies.remove(`${settings.prefix}-TOKEN`);
        this.$resetStore();
        if (this.comStatus === 'expireLogin') this.$storeSet('setExpireLogin', true);
      },
      async submit() {
        this.formRules.autoValid = false
        if (this.$refs.loginForm.validate()) {
          this.loginLoading = true;
          //登录
          let res = await login({...this.form}).catch(err => err);
          if (res.status === 200) {
            // 判断当前
            if (this.comStatus === 'expireLogin') {
              this.$emit('close-login-dialog')
              window.location.reload()
            } else {
              window.location.href = '/'
            }
            this.alertShow()
          } else if (res.status === 401.1) {
            this.alertShow('server', {
              type: 'error',
              color: 'error',
              msg: [{
                strong: '错误：',
                text: res['msg'] ? res['msg'] : '用户名或密码不正确。',
                linkText: '忘记密码？',
                link: '/login?status=passError'
              }]
            })
          } else if (notEmpty(res['msg'])) {
            this.alertShow('server', {color: res['errorType'] ? res['errorType'] : 'info', msg: [{text: res['msg']}]})
          } else {
            this.alertShow('server', {color: 'error', type: 'error', msg: [{text: '发生未知错误'}]})
          }
          this.loginLoading = false;
        } else {
          this.alertShow('errorBucket')
        }
        this.formRules.autoValid = true
      },
      resetValidation() {
        this.formRules.autoValid = true
        this.$nextTick(() => {
          this.$refs.loginForm.resetValidation()
        })
      },
      alertShow(status, alertObj) {
        if (status === 'errorBucket') {
          // 表单验证错误
          let errorBucket = this.$refs.loginForm.inputs.map(item => item.errorBucket)
          this.alertObj = {
            color: 'error',
            msg: []
          }
          errorBucket.forEach(item => {
            if (this.$notEmpty(item)) this.alertObj.msg.push({
              strong: '错误：', text: item.join(' ')
            })
          })
          this.alertFlag = true
        } else if (status === 'server') {
          // 服务器错误提示
          this.alertObj = alertObj
          this.alertFlag = true
        } else {
          this.alertFlag = false
          setTimeout(() => {
            this.alertObj = {}
          }, 500)
        }
      }
    },
    computed: {},
    watch: {
      '$query.status': {
        handler(status) {
          this.resetValidation()
          this.cookieEnabled = navigator.cookieEnabled;
          let alertObj = {msg: []}
          if (status === 'logout') {
            alertObj.type = 'info'
            alertObj.color = 'info'
            alertObj.msg.push({strong: '提示：', text: '您已注销。',})
          }
          if (!this.cookieEnabled) {
            delete alertObj.type
            alertObj.color = 'warning'
            alertObj.msg.push({strong: '警告：', text: 'Cookies已被禁用，为保证系统正常使用，请开启浏览器Cookies功能。'})
          }
          if (this.comStatus === 'expireLogin') {
            delete alertObj.type
            alertObj.color = 'warning'
            alertObj.closeIcon = false
            alertObj.msg.push({strong: '提示：', text: '会话已过期，请登录来继续您的工作。'})
          }
          if (alertObj.msg.length === 0) delete alertObj.msg;
          this.alertShow('server', alertObj)
        },
        deep: true,
        immediate: true
      },
      $route: {
        handler: function (route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      }
    },
    components: {}
  }
</script>

<style lang="scss">
  .loginContainer {
    width: 320px;
    padding: 8% 0 0 0 !important;

    h1 {
      text-align: center;

      .logoLink {
        margin: 0 auto 25px;
        width: 84px;
        height: 84px;
        background-image: url("~@/assets/logo_tran.png");
        display: block;
        background-size: 84px;
        background-position: center top;
        background-repeat: no-repeat;
        text-indent: -9999px;
      }

    }

    .loginSheet {
      padding: 36px 24px 38px;
    }

    .navDiv {
      .nav {
        margin: 24px 0 0 0;
        padding: 0 24px 0;
        font-size: 13px;
        line-height: 1.5;
      }

      .nav:last-child {
        margin: 16px 0;
      }

      .otherLink {
        color: #555d66;
      }
    }
  }

  .theme--dark .loginContainer .navDiv .otherLink {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
