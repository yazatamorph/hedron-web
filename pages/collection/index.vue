<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- <v-col cols="3" class="flex-column"> -->
        <!-- </v-col> -->
        <v-col cols="12"
          ><v-row class="d-flex flex-wrap align-left">
            <v-col
              v-for="(result, index) in handleCollection()"
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
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            class="mr-1"
            dark
            :disabled="currentPage <= 1"
            :outlined="currentPage <= 1"
            @click="handlePages(1)"
            ><v-icon>mdi-page-first</v-icon></v-btn
          >
          <v-btn
            class="mx-1"
            dark
            :disabled="currentPage <= 1"
            :outlined="currentPage <= 1"
            @click="handlePages(currentPage - 1)"
            >Previous 20</v-btn
          >
          <v-btn
            class="mx-1"
            dark
            :disabled="currentPage >= totalPages"
            :outlined="currentPage >= totalPages"
            @click="handlePages(currentPage + 1)"
            >Next 20</v-btn
          >
          <v-btn
            class="ml-1"
            dark
            :disabled="currentPage >= totalPages"
            :outlined="currentPage >= totalPages"
            @click="handlePages(totalPages)"
            ><v-icon>mdi-page-last</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CardImage from '~/components/CardImage';

export default {
  layout: 'main',
  components: {
    CardImage,
  },
  data() {
    return {
      currentPage: 1,
      totalPages: 1,
      totalCards: null,
      results: [],
    };
  },
  computed: {
    ...mapState('collection', {
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
      handler: 'handleCollection',
      deep: true,
    },
    filterOwnState: {
      handler() {
        this.currentPage = 1;
      },
    },
    filterWishState: {
      handler() {
        this.currentPage = 1;
      },
    },
  },
  methods: {
    handlePages(pageNumber) {
      this.currentPage = pageNumber;
    },

    handleCollection() {
      // 1) starts with entire collection from state
      let collection = Object.values(this.collectionCards).length
        ? Object.values(this.collectionCards)
        : [];
      // 2) applies active filters
      collection = this.filteredByWish(collection);
      if (this.filterSetsState) {
        collection = this.filteredBySet(collection);
      }
      if (this.filterColorsState.length) {
        collection = this.filteredByColors(collection);
      }
      if (this.filterRarityState.length) {
        collection = this.filteredByRarity(collection);
      }
      if (typeof this.filterCMCState === 'number') {
        collection = this.filteredByCMC(collection);
      }
      if (this.filterTagsState.length) {
        collection = this.filteredByTags(collection);
      }
      // 3) calculates total number of filtered cards & pages
      this.totalCards = collection.length;
      this.totalPages = Math.ceil(this.totalCards / 20);
      // 4) resets to first page in case user somehow managed to get past the last page
      this.currentPage =
        this.currentPage > this.totalPages ? 1 : this.currentPage;
      // 5) chunk filtered results into pages
      const displayed = this.splitIntoPages(collection);

      return displayed;
    },
    // filter, sort, and pagination helper functions to break the logic into smaller bites
    filteredByWish(collection) {
      return this.filterWishState
        ? collection.filter((card) => card.wish)
        : collection.filter((card) => card.own);
    },
    filteredBySet(collection) {
      return collection.filter((card) => card.set === this.filterSetsState);
    },
    filteredByColors(collection) {
      return collection.filter((card) =>
        this.filterColorsState.every((color) => {
          if (color === 'colorless') {
            return !card.color_identity.length;
          }
          return card.color_identity.includes(color);
        })
      );
    },
    filteredByRarity(collection) {
      return collection.filter((card) =>
        this.filterRarityState.includes(card.rarity)
      );
    },
    filteredByCMC(collection) {
      return collection.filter((card) => {
        if (this.filterCMCState === 8) {
          return card.cmc >= 8;
        }
        return card.cmc === this.filterCMCState;
      });
    },
    filteredByTags(collection) {
      return collection.filter((card) =>
        this.filterTagsState.every((tag) => card.tags.includes(tag))
      );
    },
    splitIntoPages(collection) {
      const displayed = [];
      const startIndex = this.currentPage * 20 - 20;
      const endIndex =
        this.currentPage * 20 > this.totalCards
          ? this.totalCards
          : this.currentPage * 20;

      for (let i = startIndex; i < endIndex; i++) {
        displayed.push(collection[i]);
      }

      return displayed;
    },
  },
};
</script>
