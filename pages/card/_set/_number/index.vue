<template>
  <v-container>
    <CardDetails />
    <CollectionPanel />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CardDetails from '../../../../components/CardDetails';
import CollectionPanel from '../../../../components/CollectionPanel';
// TODO: Replace this file with pages/card/index.vue once vuex/state is all set up
export default {
  components: {
    CardDetails,
    CollectionPanel,
  },
  async fetch() {
    const query = {
      set: this.$route.params.set,
      setNum: this.$route.params.number,
    };
    await this.queryCard(query);
  },
  computed: {
    ...mapState('cards', {
      card: (state) => state.card,
    }),
  },
  methods: {
    ...mapActions('cards', ['queryCard']),
  },
  fetchOnServer: false,
};
</script>
