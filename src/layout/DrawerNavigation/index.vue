<template>
  <v-list id="drawerNavigation">
    <menu-item v-if="miniMenu||logoMenu" :isLink="miniMenu" @click.stop.native="miniMenuChange">
      <template #left v-if="miniMenu">
        <v-icon>mdi-chevron-right</v-icon>
      </template>
      <template #title v-if="!miniMenu">
        <div class="d-flex align-center" v-if="logoMenu">
          <v-icon>mdi-bell</v-icon>
          <span class="font-weight-bold text-uppercase primary--text ml-3">{{menuTitle}}</span>
        </div>
      </template>
      <template #subtitle v-if="logoMenu && !miniMenu">
        <div class="d-flex justify-space-between align-center">
          <span class="overline grey--text">{{version}}</span>
          <v-btn icon @click.stop="miniMenu=!miniMenu">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </div>
      </template>
    </menu-item>
    <v-divider  v-if="miniMenu||logoMenu"/>
    <v-list-item-group v-model="activate" color="blue" class="aaa">
      <menu-item icon="mdi-home" value="home2" itemTitle="主页" link="/home2"></menu-item>
      <v-list-group no-action>

        <template #activator>
          <v-list-item-content two-line>
            <v-list-item-title>标题2</v-list-item-title>
          </v-list-item-content>
        </template>

        <menu-item itemTitle="home" icon="mdi-bell" value="home" link="/home"></menu-item>

        <v-list-group sub-group no-action>

          <template #activator>
            <v-list-item-content two-line>
              <v-list-item-title>标题2</v-list-item-title>
            </v-list-item-content>
          </template>
          <menu-item itemTitle="标题3" icon="mdi-bell"></menu-item>

        </v-list-group>

      </v-list-group>

    </v-list-item-group>

  </v-list>
</template>

<script>
  export default {
    name: "drawerNavigation",
    components: {
      MenuItem: () => import('@/components/ListItem/index'),
    },
    data() {
      return {
        activate: ''
      }
    },
    methods: {
      miniMenuChange(){
        if (this.miniMenu) this.miniMenu=!this.miniMenu
      }
    },
    computed: {
      menuTitle() {
        return this.$storeGet.setting.menuTitle
      },
      version() {
        return this.$storeGet.setting.version
      },
      logoMenu() {
        return this.$storeGet.setting.logoMenu
      },
      miniMenu: {
        get() {
          return this.$storeGet.setting.miniMenu;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'miniMenu',
            value: value
          })
        }
      },
    }
  }
</script>

<style lang="scss">
  #drawerNavigation {

  }
</style>
