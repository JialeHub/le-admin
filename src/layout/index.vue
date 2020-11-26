<template>
  <v-app id="layout">
    <v-app-bar app :dark="darkToolbar" :light="lightToolbar" :absolute="fixToolbar" :elevation="elevationToolbar">
      <app-bar @navigation-fun="navigationFun" @settings-fun="settingsFun" />
    </v-app-bar>
    <v-navigation-drawer app v-model="navigation" class="elevation-1" floating :dark="darkThemeMenu" :light="lightThemeMenu" >
      <drawer-navigation/>
    </v-navigation-drawer>
    <v-navigation-drawer fixed right v-model="settings" class="elevation-1" floating temporary :dark="darkSetting" :light="lightSetting" >
      <drawer-settings @settings-fun="settingsFun"/>
    </v-navigation-drawer>
    <v-main class="main">
      <v-container :fluid="contentLayoutFluid">
        <transition name="fade" mode="out-in">
          <router-view class="routerMain"/>
        </transition>
      </v-container>
      <v-footer absolute>
        <app-footer/>
      </v-footer>
    </v-main>

    <!--登陆提示框-->
    <v-dialog v-model="loginDialog" max-width="380" persistent>
      <v-card class="loginDialog">
        <v-btn color="primary" small class="closeBtn" icon @click="loginDialog=false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <container-login @close-login-dialog="loginDialog=false" comStatus="expireLogin"/>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  export default {
    name: "layout",
    data() {
      return {
        navigation: true,
        settings: false,
      }
    },
    components: {
      AppBar: () => import('@/layout/AppBar'),
      DrawerNavigation: () => import('@/layout/DrawerNavigation'),
      DrawerSettings: () => import('@/layout/DrawerSettings'),
      AppFooter: () => import('@/layout/Footer'),
      ContainerLogin: () => import('@/components/ContainerLogin')
    },
    methods: {
      navigationFun() {
        this.navigation = !this.navigation
      },
      settingsFun() {
        this.settings = !this.settings
      },
    },
    computed: {
      darkToolbar(){
        return this.$storeGet.setting.themesToolbar==='dark'
      },
      lightToolbar(){
        return this.$storeGet.setting.themesToolbar==='light'
      },
      darkThemeMenu(){
        return this.$storeGet.setting.themeMenu==='dark'
      },
      lightThemeMenu(){
        return this.$storeGet.setting.themeMenu==='light'
      },
      darkSetting(){
        return this.$storeGet.setting.themeSetting==='dark'
      },
      lightSetting(){
        return this.$storeGet.setting.themeSetting==='light'
      },
      contentLayoutFluid(){
        return this.$storeGet.setting.contentLayout==='fluid'
      },
      fixToolbar(){
        return !this.$storeGet.setting.fixToolbar
      },
      elevationToolbar(){
        let v = this.$storeGet.setting.fixToolbar
        return v?1:0
      },
      loginDialog: {
        get() {
          return this.$storeGet.expireLogin
        },
        set(newValue) {
          if (!newValue) this.$storeSet('setExpireLogin', newValue)
        }
      }
    },
  }
</script>

<style lang="scss">
  #layout {
    .main {
      /*background-color: #F2F5F8;*/
    }

    .loginDialog {
      padding-bottom: 20px;

      .closeBtn {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
</style>
