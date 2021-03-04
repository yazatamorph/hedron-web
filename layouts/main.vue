<template>
  <v-app>
    <v-navigation-drawer
      v-if="loggedIn && guid"
      v-model="collectOpts"
      color="transparent"
      dark
      clipped
      fixed
      app
    >
      <SortingDrawer />
    </v-navigation-drawer>
    <v-app-bar
      color="hsla(192, 50%, 15%, 1)"
      clipped-left
      elevate-on-scroll
      fixed
      app
    >
      <router-link to="/"
        ><v-img
          class="mr-4"
          max-height="48"
          max-width="48"
          src="/icon.png"
        ></v-img
      ></router-link>
      <v-btn color="white" text to="/">Hedron</v-btn>
      <v-text-field
        v-model="appBarSearch"
        class="mx-md-16"
        label="Search the Archive..."
        dark
        clearable
        clear-icon="mdi-trash-can-outline"
        solo
        dense
        hide-details
        :flat="searchFlat"
        @focus="searchFlat = false"
        @blur="searchFlat = true"
        @keydown.enter="handleSearch"
      >
      </v-text-field>
      <!-- <v-menu offset-y bottom left :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template> -->
      <AccountDialogues :is-dark="true" />
      <!-- </v-menu> -->
    </v-app-bar>
    <v-main class="bg-gradient">
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
import AccountDialogues from '~/components/AccountDialogues';
// import AccountMenu from '~/components/AccountMenu';
import SortingDrawer from '~/components/SortingDrawer';

export default {
  components: {
    AccountDialogues,
    // AccountMenu,
    SortingDrawer,
  },
  middleware: 'storeRestored',
  data() {
    return {
      appBarSearch: '',
      collectOpts: true,
      fixed: false,
      title: 'Hedron',
      searchFlat: true,
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

<style>
.bg-gradient {
  background: hsla(192, 9%, 20%, 1);

  background: linear-gradient(
    -90deg,
    hsla(192, 50%, 15%, 1) 10%,
    hsla(192, 31%, 40%, 1) 100%
  );

  background: -moz-linear-gradient(
    -90deg,
    hsla(192, 50%, 15%, 1) 10%,
    hsla(192, 31%, 40%, 1) 100%
  );

  background: -webkit-linear-gradient(
    -90deg,
    hsla(192, 50%, 15%, 1) 10%,
    hsla(192, 31%, 40%, 1) 100%
  );

  filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#132226", endColorstr="#466066", GradientType=1 );
}
</style>
