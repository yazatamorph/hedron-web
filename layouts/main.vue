<template>
  <v-app>
    <v-navigation-drawer
      v-if="loggedIn && $route.path !== '/'"
      v-model="collectOpts"
      :color="handleCollectColor()"
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
      :extension-height="
        $vuetify.breakpoint.mdAndDown && $route.path !== '/' ? 56 : 0
      "
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
      <v-btn v-if="loggedIn" color="white" text to="/collection"
        >Collection</v-btn
      >
      <v-spacer
        v-if="$vuetify.breakpoint.mdAndDown || $route.path === '/'"
      ></v-spacer>
      <v-text-field
        v-if="$vuetify.breakpoint.lgAndUp && $route.path !== '/'"
        v-model="appBarSearch"
        class="ml-4"
        label="Search the Archive..."
        dark
        clearable
        :clear-icon="icon.trash"
        solo
        dense
        hide-details
        :flat="searchFlat"
        @focus="searchFlat = false"
        @blur="searchFlat = true"
        @keydown.enter="handleSearch"
      >
        <template v-slot:append>
          <v-btn
            icon
            plain
            color="white"
            href="https://scryfall.com/docs/syntax"
            ><v-icon>{{ icon.help }}</v-icon></v-btn
          >
        </template>
      </v-text-field>
      <AccountDialogues :is-dark="true" />

      <template
        v-if="$vuetify.breakpoint.mdAndDown && $route.path !== '/'"
        v-slot:extension
      >
        <v-btn v-if="loggedIn" icon color="white" @click="handleCollectMenu()"
          ><v-icon>{{ icon.menu }}</v-icon></v-btn
        >
        <v-text-field
          v-model="appBarSearch"
          class="my-4"
          label="Search the Archive..."
          dark
          clearable
          :clear-icon="icon.trash"
          solo
          dense
          hide-details
          :flat="searchFlat"
          @focus="searchFlat = false"
          @blur="searchFlat = true"
          @keydown.enter="handleSearch"
        >
          <template v-slot:append>
            <v-btn
              icon
              plain
              color="white"
              href="https://scryfall.com/docs/syntax"
              ><v-icon>{{ icon.help }}</v-icon></v-btn
            >
          </template>
        </v-text-field>
      </template>
    </v-app-bar>
    <v-main class="bg-gradient">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer dark absolute app padless>
      <v-card class="flex" flat tile>
        <v-container>
          <v-row class="justify-space-around">
            <v-btn to="/" text>Hedron</v-btn>
            <v-btn to="/contact" text>Contact</v-btn>
            <v-btn href="https://github.com/yazatamorph/hedron-web" text
              >Contribute <v-icon right>{{ icon.github }}</v-icon></v-btn
            >
            <v-btn to="/terms" text>Terms of Service</v-btn>
            <v-btn to="/privacy" text>Privacy Policy</v-btn>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card-text class="grey--text text-caption">
                Hedron makes use of textual and visual information, including
                card text and images, that is copyright Wizards of the Coast,
                LLC, a subsidiary of Hasbro, Inc. This use constitutes
                unofficial Fan Content as permitted under the Wizards of the
                Coast Fan Content Policy. Hedron is in no way produced by,
                endorsed by, supported by, or affiliated with Wizards of the
                Coast or its parent company.
                <br />
                <br />
                Card data and images used by Hedron are provided courtesy of
                <a
                  class="grey--text text--lighten-2 text-decoration-none"
                  href="https://scryfall.com"
                  >Scryfall</a
                >. Hedron is in no way produced by, endorsed by, supported by,
                or affiliated with Scryfall.
                <br />
                <br />
                The GitHub logo is copyright
                <a
                  class="grey--text text--lighten-2 text-decoration-none"
                  href="https://github.com"
                  >GitHub, Inc</a
                >. Hedron is in no way produced by, endorsed by, supported by,
                or affiliated with GitHub.
                <br />
                <br />
                Hedron is &copy;
                {{ new Date().getFullYear() }}
                <a
                  class="grey--text text--lighten-2 text-decoration-none"
                  href="https://github.com/yazatamorph/hedron-web/graphs/contributors"
                  >Yazatamorph and Friends</a
                >. It is free and open source software licensed under the
                <a
                  class="grey--text text--lighten-2 text-decoration-none"
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  >GNU General Public License v3.0</a
                >. All dependencies and bundled software are copyright their
                authors and subject to their original licenses.
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import {
  mdiMenu,
  mdiHelpCircleOutline,
  mdiTrashCanOutline,
  mdiGithub,
} from '@mdi/js';
import { mapState } from 'vuex';
import AccountDialogues from '~/components/AccountDialogues';
import SortingDrawer from '~/components/SortingDrawer';

export default {
  components: {
    AccountDialogues,
    SortingDrawer,
  },
  data() {
    return {
      icon: {
        github: mdiGithub,
        help: mdiHelpCircleOutline,
        menu: mdiMenu,
        trash: mdiTrashCanOutline,
      },
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
  beforeMount() {
    if (this.$vuetify.breakpoint.mdAndDown) {
      this.collectOpts = false;
    }
  },
  methods: {
    handleCollectMenu() {
      this.collectOpts = !this.collectOpts;
    },
    handleCollectColor() {
      return this.$vuetify.breakpoint.lgAndUp
        ? 'transparent'
        : 'hsla(192, 50%, 15%, 1)';
    },
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
