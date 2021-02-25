<template>
  <v-container>
    <LoadingOverlay :displaying="searchInProgress" />

    <v-row>
      <v-col cols="12">
        <v-card dark>
          <v-card-title
            >Showing results for search&nbsp;
            <strong>{{ decodedQueryString }}</strong></v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
    <v-row class="d-flex flex-wrap align-left">
      <v-col
        v-for="(result, index) in displayedResults"
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
        <v-row>
          <v-col cols="12">
            <v-menu
              offset-y
              transition="slide-y-reverse-transition"
              open-on-hover
              :close-on-content-click="false"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="grey darken-4"
                  dark
                  block
                  depressed
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item dense class="mb-n5">
                  <v-list-item-title>{{ result.name }}</v-list-item-title>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-subtitle
                    >{{ result.set_name }}
                    {{ result.collector_number }}</v-list-item-subtitle
                  >
                </v-list-item>
                <v-list-item dense>
                  <v-switch
                    :input-value="
                      collectionCards[handleCardId(result)]
                        ? collectionCards[handleCardId(result)].own
                        : false
                    "
                    color="teal accent-4"
                    label="Owned"
                    @change="handleOwn(result)"
                  ></v-switch>
                </v-list-item>
                <v-list-item dense>
                  <v-switch
                    :input-value="
                      collectionCards[handleCardId(result)]
                        ? collectionCards[handleCardId(result)].wish
                        : false
                    "
                    color="teal accent-4"
                    label="Wishlist"
                    @change="handleWish(result)"
                  ></v-switch>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          class="mr-1"
          dark
          :disabled="currentPage === 1"
          :outlined="currentPage === 1"
          @click="makePages(1)"
          ><v-icon>mdi-page-first</v-icon></v-btn
        >
        <v-btn
          class="mx-1"
          dark
          :disabled="currentPage === 1"
          :outlined="currentPage === 1"
          @click="makePages(currentPage - 1)"
          >Previous 20</v-btn
        >
        <v-btn
          class="mx-1"
          dark
          :disabled="currentPage >= totalPages"
          :outlined="currentPage >= totalPages"
          @click="makePages(currentPage + 1)"
          >Next 20</v-btn
        >
        <v-btn
          class="ml-1"
          dark
          :disabled="currentPage >= totalPages"
          :outlined="currentPage >= totalPages"
          @click="makePages(totalPages)"
          ><v-icon>mdi-page-last</v-icon></v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import replace from 'lodash/replace';
import CardImage from '~/components/CardImage';
import LoadingOverlay from '~/components/LoadingOverlay';

export default {
  layout: 'main',
  components: {
    CardImage,
    LoadingOverlay,
  },
  async fetch() {
    await this.handleSearch();
    this.makePages(1);
  },
  data() {
    return {
      results: [],
      displayedResults: [],
      totalCards: null,
      nextResultsURI: undefined,
      currentPage: 1,
      totalPages: 1,
      decodedQueryString: '',
      searchInProgress: false,
    };
  },
  computed: {
    ...mapState('collection', {
      collectionCards: (state) => state.cards,
    }),
  },
  methods: {
    ...mapActions('collection', ['changeOwn', 'changeWish']),

    async handleSearch() {
      try {
        const queryParams = this.$route.params.terms;
        this.decodedQueryString = decodeURIComponent(queryParams);
        this.searchInProgress = true;

        let data = await this.$axios.$get(
          `/scry/cards/search?order=set&q=${replace(queryParams, /\s/g, '+')}`,
          { skipAuthRefresh: true }
        );
        /* eslint-disable camelcase */
        const { total_cards = null } = data;
        let {
          has_more = false,
          next_page = undefined,
          data: results = [],
        } = data;

        while (has_more) {
          data = await this.$axios.$get(next_page, { skipAuthRefresh: true });
          has_more = data.has_more;
          if (data.has_more) {
            next_page = data.next_page;
          }
          results = [...results, ...data.data];
        }

        this.searchInProgress = false;
        this.results = results;
        this.totalCards = total_cards;
        this.totalPages = Math.ceil(this.totalCards / 20);
        /* eslint-enable camelcase */
      } catch (err) {
        this.searchInProgress = false;
        console.error('Problem getting results from Scryfall', err);
      }
    },

    makePages(pageNumber) {
      const toDisplay = [];
      const startIndex = pageNumber * 20 - 20;
      const endIndex =
        pageNumber * 20 > this.totalCards ? this.totalCards : pageNumber * 20;

      for (let i = startIndex; i < endIndex; i++) {
        toDisplay.push(this.results[i]);
      }

      this.displayedResults = toDisplay;
      this.currentPage = pageNumber;
    },

    handleOwn(card) {
      const cID = this.handleCardId(card);
      const cardData = this.handleCardData(card);

      this.changeOwn({
        cID,
        cardData,
      });
    },

    handleWish(card) {
      const cID = this.handleCardId(card);
      const cardData = this.handleCardData(card);

      this.changeWish({
        cID,
        cardData,
      });
    },

    handleCardId(card) {
      return `${card.set}${card.collector_number}`;
    },

    handleCardData(card) {
      if (!this.collectionCards[this.handleCardId(card)]) {
        const newCard = {
          setNumAbbr: this.handleCardId(card),
          collector_number: card.collector_number,
          name: card.name,
          set: card.set,
          set_name: card.set_name,
          color_identity: card.color_identity,
          rarity: card.rarity,
          cmc: card.cmc,
          own: false,
          wish: false,
          condition: {
            nm: 0,
            lp: 0,
            mp: 0,
            hp: 0,
            dmg: 0,
            nmf: 0,
            lpf: 0,
            mpf: 0,
            hpf: 0,
            dmgf: 0,
          },
          tags: [],
          comments: '',
        };

        if (card.image_uris && card.image_uris.normal) {
          newCard.image_uris = card.image_uris;
        }
        if (
          card.card_faces &&
          card.card_faces.length &&
          card.card_faces[0].image_uris
        ) {
          newCard.card_faces = card.card_faces;
        }

        return newCard;
      }
      return this.collectionCards[this.handleCardId(card)];
    },
  },
};
</script>
