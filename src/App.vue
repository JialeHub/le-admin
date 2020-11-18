<template>
  <v-app>
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view class="router" style=""/>
      </transition>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
  #app{

  }
</style>
