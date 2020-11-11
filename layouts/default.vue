<template>
  <v-app>
    <v-app-bar elevation="1" dense fixed app>
      <v-app-bar-nav-icon
        ><v-icon>mdi-cards-diamond</v-icon></v-app-bar-nav-icon
      >
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main class="grey lighten-2">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      fixed: false,
      title: 'Hedron',
    };
  },
};
</script>
