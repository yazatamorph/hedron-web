<template>
  <v-container>
    <LoadingOverlay :displaying="searchInProgress" />
    <CardDetails
      v-if="!searchInProgress"
      :card="card"
      :prints="prints"
      :set-symbol="setSymbol"
      :card-id="cID"
      :set-abbr="$route.params.set.toUpperCase()"
      :num="$route.params.number.toLowerCase()"
    />
  </v-container>
</template>

<script>
import CardDetails from '~/components/CardDetails';
import LoadingOverlay from '~/components/LoadingOverlay';

export default {
  layout: 'main',
  components: {
    CardDetails,
    LoadingOverlay,
  },
  async fetch() {
    await this.getCardData();
  },
  data() {
    return {
      cID: `${this.$route.params.set}${this.$route.params.number}`,
      card: {},
      prints: [],
      setSymbol: '',
      searchInProgress: false,
      set: this.$route.params.set,
      setNum: this.$route.params.number,
    };
  },
  methods: {
    async getCardData() {
      try {
        this.searchInProgress = true;
        const data = await this.$axios.$get(
          `https://api.scryfall.com/cards/${this.set}/${this.setNum}`
        );

        this.card = data;

        await Promise.all([
          this.$axios.$get(this.card.prints_search_uri).then((res) => {
            this.prints = res.data.filter(
              (print) =>
                this.card.set !== print.set ||
                this.card.collector_number !== print.collector_number
            );
          }),
          this.$axios
            .$get(`https://api.scryfall.com/sets/${this.card.set}`)
            .then((res) => {
              this.setSymbol = res.icon_svg_uri;
            }),
        ]);

        this.searchInProgress = false;
      } catch (err) {
        this.searchInProgress = false;
        console.error('Problem getting card data from Scryfall API:', err);
      }
    },
  },
  fetchOnServer: false,
};
</script>
