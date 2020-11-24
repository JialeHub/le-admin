<template>
  <v-app id="layout">
    <v-app-bar app color="white">
      <app-bar @navigationFun="navigationFun" @settingsFun="settingsFun" slot="default"/>
    </v-app-bar>
    <v-navigation-drawer app v-model="navigation" class="elevation-1" floating >
      <drawer-navigation/>
    </v-navigation-drawer>
    <v-navigation-drawer fixed right v-model="settings" class="elevation-1" floating temporary>
      <drawer-settings/>
    </v-navigation-drawer>
    <v-main class="main">
      <v-container fluid>
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
        <container-login @closeLoginDialog="loginDialog=false" comStatus="expireLogin"/>
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
        settings: true,
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
      background-color: #F2F5F8;
    }

    .loginDialog {
      background-color: #F2F5F8;
      padding-bottom: 20px;

      .closeBtn {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
</style>
