<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title
            >Showing results for search:&nbsp;
            <strong>{{ $route.params.terms }}</strong></v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
    <v-row class="d-flex flex-wrap justify-space-around">
      <v-col
        v-for="(result, index) in results"
        :key="`searchResultKey${index}`"
        rows="12"
        sm="4"
        md="3"
      >
        <!-- I don't feel totally confident this link will work as expected lol -->
        <nuxt-link :to="`/card/${result.set}/${result.collector_number}`">
          <CardImage
            :image-source="result.image_uris.png"
            :alt-text="`${result.name} (${result.set.toUpperCase()} #${
              result.collector_number
            })`"
          />
        </nuxt-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :class="totalPages > 1 ? 'd-flex' : 'd-none'"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CardImage from '~/components/CardImage';
import parseTerms from '~/assets/parseTerms';

export default {
  components: {
    CardImage,
  },
  async fetch() {
    await this.handleSearch();
  },
  data() {
    return {
      results: [],
      currentPage: 1,
      totalPages: 1,
    };
  },
  methods: {
    async handleSearch() {
      try {
        const query = {
          terms: parseTerms(this.$route.params.terms),
          page: this.currentPage,
        };

        const data = await this.$axios.$post(
          'http://localhost:3420/api/query/search',
          {
            query,
          }
        );

        const { results = [], totalPages = 1, currentPage = 1 } = data;

        this.results = results;
        this.totalPages = totalPages;

        if (this.currentPage !== currentPage) {
          this.currentPage = currentPage;
        }
      } catch (err) {
        console.error('Problem getting search results!', err);
      }
    },
  },
};
</script>
