<template>
    <v-list-item class="listItem">
      <v-list-item-content two-line>
        <v-list-item-title><slot name="title"/>{{itemTitle}}</v-list-item-title>
        <v-list-item-subtitle>
          <slot name="subtitle"/>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <slot name="action"/>
      </v-list-item-action>
      <slot/>
    </v-list-item>
</template>

<script>
  export default {
    name: "listItem",
    props: {
      itemTitle: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style lang="scss">

</style>
