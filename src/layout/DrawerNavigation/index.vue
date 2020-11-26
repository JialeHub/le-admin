<template>
  <div id="drawerNavigation">
    <v-list nav v-show="logoMenu">
      <menu-item>
        <span slot="title" class="text-h6 blue--text text--lighten-1">{{menuTitle}}</span>
        <span slot="subtitle" class="subtitle-2">{{version}}</span>
      </menu-item>
      <v-divider />
    </v-list>
  </div>
</template>

<script>
  export default {
    name: "drawerNavigation",
    components: {
      MenuItem: () => import('@/components/ListItem/index')
    },
    data() {
      return {}
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
    }
  }
</script>

<style lang="scss">

</style>
