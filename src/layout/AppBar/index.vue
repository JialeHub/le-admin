<template>
  <div id="appBar">
    <v-app-bar-nav-icon @click.stop="navigationSet" ></v-app-bar-nav-icon>

    <v-spacer></v-spacer>


    <v-app-bar-nav-icon @click.stop="settingsSet">
      <v-btn icon><v-icon>mdi-cog-outline</v-icon></v-btn>
    </v-app-bar-nav-icon>

    <v-btn icon><v-icon>mdi-bell-outline</v-icon></v-btn>

    <v-menu bottom min-width="200px" rounded offset-y>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" elevation="1">
          <v-avatar size="40" >
            <v-btn icon><v-icon>mdi-account-circle</v-icon></v-btn>
          </v-avatar>
        </v-btn>
      </template>
      <v-card >
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center">
            <v-avatar color="brown" >
              <span class="white--text headline">JD</span>
            </v-avatar>
            <h3>Micro Lee</h3>
            <p class="caption mt-1">
             799670335@qq.com
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text>
              Edit Account
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text>
              Disconnect
            </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>

  </div>
</template>

<script>
  export default {
    name: "appBar",
    data() {
      return {}
    },
    methods: {
      navigationSet(){
        this.$emit('navigation-fun',)
      },
      settingsSet(){
        this.$emit('settings-fun',)
      },
    },
  }
</script>

<style lang="scss">
  #appBar{
    width: 100%;
    align-items: center;
    display: flex;
    position: relative;
    z-index: 0;
  }
</style>
