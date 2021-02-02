<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- <v-col cols="3" class="flex-column"> -->
        <!-- </v-col> -->
        <v-col cols="12"
          ><v-row class="d-flex flex-wrap align-left">
            <v-col
              v-for="(result, index) in results"
              :key="`searchResultKey${index}`"
              rows="12"
              sm="4"
              md="3"
            >
              <CardImage
                :image-source="
                  result.card_faces &&
                  result.card_faces.length &&
                  result.card_faces[0].image_uris
                    ? [
                        result.card_faces[0].image_uris.normal,
                        result.card_faces[1].image_uris.normal,
                      ]
                    : [result.image_uris.normal]
                "
                :alt-text="`${result.name} (${result.set.toUpperCase()} #${
                  result.collector_number
                })`"
                :link-dest="`/card/${result.set}/${result.collector_number}`"
              />
            </v-col> </v-row
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :class="totalPages > 1 ? 'd-flex' : 'd-none'"
            @input="handleSearch"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CardImage from '~/components/CardImage';

export default {
  components: {
    CardImage,
  },
  async fetch() {
    await this.handleSearch();
  },
  data() {
    return {
      currentPage: 1,
      decodedQueryString: '',
      results: [],
      totalPages: 1,
    };
  },
  computed: {
    ...mapState('collection', {
      collectionCards: (state) => state.cards,
      filters: (state) => state.filters,
    }),
  },
  methods: {
    async handleSearch(opts = { own: true, wish: false }) {
      try {
        const cardSelection = Object.values(this.collectionCards)
          .filter(
            // this filter function needs work lol
            ({ own, wish }) => opts.own === own && opts.wish === wish
          )
          // eslint-disable-next-line camelcase
          .map(({ set, collector_number }) => {
            return { set, collector_number };
          });

        // Collection: { SET000: { set: 'set', collector_number: '000', own: true }, ... }
        // This block checks collection store for cards with matching tags.
        // If it finds matches, it returns the matches' set & number to be
        // part of the MongoDB search query.
        // if (terms.tags) {
        //   const matchingCards = Object.values(this.collectionCards)
        //     .filter(({ tags }) => terms.tags.every((tag) => tags.includes(tag)))
        //     // eslint-disable-next-line camelcase
        //     .map(({ set, collector_number }) => {
        //       return { set, collector_number };
        //     });

        //   if (matchingCards && matchingCards.length) {
        //     terms.tags = matchingCards;
        //   } else {
        //     delete terms.tags;
        //   }
        // }

        const query = {
          collection: cardSelection,
          page: this.currentPage,
        };

        const data = await this.$axios.$post(
          'http://localhost:3420/api/query/collection/all',
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
        console.error(
          'Problem retrieving detailed collection information!',
          err
        );
      }
    },
  },
};
</script>
