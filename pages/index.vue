<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10">
        <div class="text-center text-h3 white--text mt-md-10 mb-md-n2">
          Welcome to the Archive, Planeswalker.
        </div>
        <br />
        <div class="text-center text-h5 white--text mb-md-10">
          <strong>Hedron</strong> is a collection manager for
          <strong>Magic: The Gathering</strong>.
        </div>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="cardSearch"
          label="Search the Archive..."
          dark
          clearable
          clear-icon="mdi-trash-can-outline"
          solo
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mdiHelpCircleOutline } from '@mdi/js';
export default {
  layout: 'main',
  data() {
    return {
      icon: {
        help: mdiHelpCircleOutline,
      },
      cardSearch: '',
      searchFlat: true,
    };
  },
  methods: {
    handleSearch() {
      if (this.cardSearch) {
        const encoded = encodeURIComponent(this.cardSearch);

        window.$nuxt.$router.push(`/search/${encoded}`);
      }
    },
  },
};
</script>
