<template>
  <v-app>
    <v-app-bar class="grey darken-3" elevation="1" dark fixed app>
      <v-text-field
        v-model="appBarSearch"
        label="Search the Archive..."
        clearable
        clear-icon="mdi-trash-can-outline"
        single-line
        hide-details
      >
        <template v-slot:prepend>
          <v-icon class="d-flex">mdi-cards-diamond</v-icon>
          <div class="mx-2 text-h5 d-none d-md-flex" v-text="title"></div>
        </template>
      </v-text-field>
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
      fixed: false,
      title: 'Hedron',
      appBarSearch: '',
    };
  },
};
</script>
