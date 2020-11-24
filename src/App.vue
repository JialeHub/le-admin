<template>
  <transition name="fade" mode="out-in">
    <router-view class="router" style=""/>
  </transition>
</template>

<script>

  export default {
    name: 'App',

    components: {},

    mounted() {

    },

    data: () => ({}),
  };
</script>

<style lang="scss">
  #app {

  }
</style>
