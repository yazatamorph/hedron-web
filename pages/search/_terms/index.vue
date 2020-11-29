<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title
            >Showing results for search:&nbsp;
            <strong>{{ parsedSearchString }}</strong></v-card-title
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
import { mapState } from 'vuex';
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
      parsedSearchString: '',
    };
  },
  computed: {
    ...mapState('collection', {
      collectionCards: (state) => state.cards,
    }),
  },
  methods: {
    async handleSearch() {
      try {
        const terms = parseTerms(this.$route.params.terms);
        // TODO: write a function to stringify the 'terms' object
        this.parsedSearchString = terms.toString();

        // This block checks collection store for cards with matching tags.
        // If it finds matches, it returns the matches' set & number to be
        // part of the MongoDB search query.
        if (terms.tags) {
          const matchingCards = Object.values(this.collectionCards)
            .filter(({ tags }) => terms.tags.every((tag) => tags.includes(tag)))
            // eslint-disable-next-line camelcase
            .map(({ set, collector_number }) => {
              return { set, collector_number };
            });

          if (matchingCards && matchingCards.length) {
            terms.tags = matchingCards;
          } else {
            delete terms.tags;
          }
        }

        const query = {
          terms,
          page: this.currentPage,
        };

        const data = await this.$axios.$post(
          'http://localhost:3420/api/query/search',
          {
            ...query,
          }
        );

        const { results = [], totalPages = 1, currentPage = 1 } = data;

        if (results.length && results.length === 1) {
          window.$nuxt.$router.push(
            `/card/${results[0].set}/${results[0].collector_number}`
          );
        }

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
