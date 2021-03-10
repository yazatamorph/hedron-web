<template>
  <v-app>
    <v-app-bar color="transparent" clipped-left flat fixed app>
      <router-link to="/"
        ><v-img
          class="mr-4"
          max-height="48"
          max-width="48"
          src="/icon.png"
        ></v-img
      ></router-link>
      <v-btn color="white" text to="/">Hedron</v-btn>
      <v-btn v-if="loggedIn" color="white" text to="/collection"
        >Collection</v-btn
      >
      <v-spacer></v-spacer>
      <AccountDialogues />
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

export default {
  components: {
    AccountDialogues,
  },
  data() {
    return {
      appBarSearch: '',
      collectOpts: false,
      fixed: false,
      searchFlat: true,
    };
  },
  computed: {
    ...mapState({
      loggedIn: (state) => state.loggedIn,
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
