<template>
  <div id="login">
    <v-container fluid class="pa-0 loginContainer">
      <!--Logo-->
      <v-row no-gutters class="loginRow" justify="center">
        <h1>
          <router-link to="/login" class="logoLink">LE后台管理系统</router-link>
        </h1>
      </v-row>
      <!--提示框-->
      <v-row no-gutters>
        <v-alert :type="alertObj.type" border="left" colored-border :color="`${alertObj.color} accent-4`"
                 class="alertSheet w100" transition="slide-y-transition" :value="alertFlag">
            <span>
              <strong>{{alertObj.strong}}</strong>{{alertObj.text}}
              <router-link to="/forget" class="underLink link0" v-if="status==='passError'">忘记密码?</router-link>
            </span>
        </v-alert>
      </v-row>
      <!--登录框-->
      <v-row no-gutters>
        <v-sheet class="wpSheet loginSheet w100">
          <v-form ref="form" v-model="formRules.formValid" :lazy-validation="true">
            <v-text-field v-model="form.username" label="用户名或电子邮件地址" required
                          :rules="formRules.usernameRules"></v-text-field>
            <v-text-field v-model="form.password" label="密码" required :rules="formRules.passRules"
                          :type="form.showPass ? 'text' : 'password'"
                          :append-icon="form.showPass ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="form.showPass = !form.showPass"></v-text-field>
            <v-row no-gutters justify="space-between" align="center">
              <v-checkbox v-model="form.remember" label="记住我的登录信息" :ripple="false"></v-checkbox>
              <v-btn depressed color="primary">登录</v-btn>
            </v-row>
          </v-form>
        </v-sheet>
      </v-row>
      <!--其他链接-->
      <v-row no-gutters>
        <div class="navDiv">
          <p class="nav">
            <router-link to="/login?status=passError" class="otherLink link1">密码错误测试</router-link>
            <br>
            <router-link to="/login?status=logout" class="otherLink link1">退出登录测试</router-link>
            <br>
            <router-link to="/login" class="otherLink link1">关闭提示</router-link>
          </p>
          <p class="nav">
            <router-link to="/forget" class="otherLink link1">忘记密码？</router-link>
          </p>
          <p class="nav">
            <router-link to="/login" class="otherLink link2">← 返回站点</router-link>
          </p>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>

  export default {
    name: 'Login',
    data() {
      return {
        alertObj: {},
        alertFlag: false,
        status: null,
        formRules: {
          formValid: true,
          usernameRules: [v => !!v || ''],
          passRules: [v => !!v || ''],
        },
        form: {
          username: '',
          password: '',

          remember: false,
          showPass: false
        }
      };
    },
    mounted() {
      console.log(this.$notEmpty(''));
    },
    watch: {
      '$route.query.status': {
        handler(status) {
          this.status = status
          this.alertShow(status)
        },
        deep: true,
        immediate: true
      }
    },
    computed: {},
    methods: {
      alertShow(status) {
        if (status === 'passError') {
          this.alertObj = {
            iconShow: true,
            type: 'error',
            color: 'error',
            strong: '错误：',
            text: '用户名或密码不正确。',
          }
          this.alertFlag = true
        } else if (status === 'logout') {
          this.alertObj = {
            iconShow: false,
            type: 'info',
            color: 'info',
            strong: '',
            text: '你已注销。',
          }
          this.alertFlag = true
        } else {
          this.alertFlag = false
          setTimeout(() => {
            this.alertObj = {}
          }, 500)
        }
      }
    },
    components: {}
  }
</script>

<style lang="scss">
  #login {
    .loginContainer {
      width: 320px;
      padding-top: 8% !important;

      h1 {
        text-align: center;

        .logoLink {
          margin: 0 auto 25px;
          width: 84px;
          height: 84px;
          background-image: url("~@/assets/le_Admin_logo.png");
          display: block;
          background-size: 84px;
          background-position: center top;
          background-repeat: no-repeat;
          text-indent: -9999px;
        }

      }

      .loginSheet {
        padding-top: 36px;
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
  }
</style>
