<template>
  <v-app>
    <v-navigation-drawer v-model="collectOpts" dark clipped fixed app>
      <SortingDrawer />
    </v-navigation-drawer>
    <v-app-bar color="grey darken-3" clipped-left dark fixed app>
      <v-app-bar-nav-icon
        v-if="loggedIn && guid"
        @click.stop="collectOpts = !collectOpts"
      />
      <!-- <v-btn icon @click.stop="collectOpts = !collectOpts">
        <v-icon
          >mdi-cards-diamond{{ `${collectOpts ? '-outline' : ''}` }}</v-icon
        >
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <!-- <v-spacer></v-spacer> -->
      <v-text-field
        v-model="appBarSearch"
        class="mx-md-6"
        label="Search the Archive..."
        clearable
        clear-icon="mdi-trash-can-outline"
        single-line
        hide-details
        @keydown.enter="handleSearch"
      >
      </v-text-field>
      <v-menu offset-y bottom left :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <AccountMenu />
      </v-menu>
    </v-app-bar>
    <v-main class="grey lighten-2">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer fixed app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import AccountMenu from '~/components/AccountMenu';
import SortingDrawer from '~/components/SortingDrawer';

export default {
  components: {
    AccountMenu,
    SortingDrawer,
  },
  middleware: 'storeRestored',
  data() {
    return {
      appBarSearch: '',
      collectOpts: false,
      fixed: false,
      title: 'Hedron',
    };
  },
  computed: {
    ...mapState({
      loggedIn: (state) => state.loggedIn,
      guid: (state) => state.user.guid,
    }),
  },
  methods: {
    handleSearch() {
      if (this.appBarSearch) {
        const encoded = encodeURIComponent(this.appBarSearch);

        window.$nuxt.$router.push(`/search/${encoded}`);
      }
    },
  },
};
</script>
