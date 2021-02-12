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
            @input="handlePagination"
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
    this.currentPage = this.$route.query.page
      ? parseInt(this.$route.query.page)
      : 1;
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
      guid: (state) => state.guid,
      collectionCards: (state) => state.cards,
      filterRootState: (state) => state.filters,
      filterOwnState: (state) => state.filters.own,
      filterWishState: (state) => state.filters.wish,
      filterRarityState: (state) => state.filters.rarity,
      filterSetsState: (state) => state.filters.sets,
      filterColorsState: (state) => state.filters.colors,
      filterCMCState: (state) => state.filters.cmc,
      filterTagsState: (state) => state.filters.tags,
    }),
  },
  watch: {
    filterRootState: {
      handler: 'handleSearch',
      deep: true,
    },
  },
  methods: {
    handlePagination(page) {
      window.$nuxt.$router.push({ query: { page } });
      this.handleSearch();
    },

    async handleSearch() {
      try {
        const query = {
          guid: this.guid,
          page: this.currentPage,
        };

        if (!this.$route.query.page) {
          query.page = 1;
        }

        if (
          this.filterSetsState ||
          this.filterColorsState.length ||
          this.filterRarityState ||
          this.filterCMCState ||
          this.filterTagsState.length ||
          this.filterWishState
        ) {
          query.filters = {};
          if (this.filterSetsState) {
            query.filters.sets = this.filterSetsState;
          }
          if (this.filterColorsState.length) {
            query.filters.colors = this.filterColorsState;
          }
          if (this.filterRarityState.length) {
            query.filters.rarity = this.filterRarityState;
          }
          if (this.filterCMCState) {
            query.filters.cmc = this.filterCMCState;
          }
          if (this.filterTagsState.length) {
            query.filters.tags = this.filterTagsState;
          }
          if (this.filterWishState) {
            query.filters.wish = this.filterWishState;
          }
        }

        const data = await this.$axios.$post(
          'http://localhost:3420/api/collection/query',
          {
            ...query,
          }
        );

        const { results = [], totalPages = 1, currentPage = 1 } = data;

        // if (results.length && results.length === 1) {
        //   window.$nuxt.$router.push(
        //     `/card/${results[0].set}/${results[0].collector_number}`
        //   );
        // }

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
