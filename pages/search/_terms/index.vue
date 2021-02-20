<template>
  <v-container>
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
                  <!-- <v-list-item-content> -->
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
                    inset
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
                    inset
                    color="cyan accent-4"
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
      <v-col cols="10" offset="1">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :class="totalPages > 1 ? 'd-flex' : 'd-none'"
          color="grey darken-4"
          @input="handlePagination"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CardImage from '~/components/CardImage';
import parseTerms from '~/assets/parseTerms';

export default {
  layout: 'main',
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
      results: [],
      currentPage: 1,
      totalPages: 1,
      decodedQueryString: '',
    };
  },
  computed: {
    ...mapState('collection', {
      collectionCards: (state) => state.cards,
    }),

    // currentPage: {
    //   get() {

    //   },
    //   set(value) {

    //   },
    // },
  },
  methods: {
    ...mapActions('collection', ['changeOwn', 'changeWish']),

    handlePagination(page) {
      window.$nuxt.$router.push({ query: { page } });
      this.handleSearch();
    },

    async handleSearch() {
      try {
        this.decodedQueryString = decodeURIComponent(this.$route.params.terms);
        const terms = parseTerms(this.decodedQueryString);

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
      return `${card.set.toUpperCase()}${card.collector_number.toLowerCase()}`;
    },

    handleCardData(card) {
      return this.collectionCards[this.handleCardId(card)]
        ? this.collectionCards[this.handleCardId(card)]
        : {
            set: card.set.toLowerCase(),
            collector_number: card.collector_number,
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
    },
  },
};
</script>
