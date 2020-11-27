<template>
  <v-container></v-container>
</template>

<script>
export default {
  async fetch() {
    const query = {
      terms: this.$route.params.terms,
    };
    await query;
    // await this.queryCard(query);
  },
};
</script>
