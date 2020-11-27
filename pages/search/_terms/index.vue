<template>
  <v-container>
    <v-card>
      <v-card-title
        >Showing results 1 - 12 for search:&nbsp;
        <strong>{{ $route.params.terms }}</strong></v-card-title
      >
    </v-card>
    <v-row class="d-flex flex-wrap justify-space-around">
      <v-col v-for="i in 12" :key="`imgKey${i}`" rows="12" sm="4" md="3">
        <CardImage
          image-source="https://c1.scryfall.com/file/scryfall-cards/large/front/c/2/c2e8b424-0cec-490e-a571-bd051f952adf.jpg?1599708487"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CardImage from '../../../components/CardImage';

export default {
  components: {
    CardImage,
  },
  async fetch() {
    const query = {
      terms: this.$route.params.terms,
    };
    await query;
    // await this.queryCard(query);
  },
};
</script>
