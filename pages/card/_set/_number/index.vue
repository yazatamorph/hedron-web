<template>
  <v-container>
    <CardDetails
      :card-id="cID"
      :set-abbr="$route.params.set.toUpperCase()"
      :num="$route.params.number.toLowerCase()"
    />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CardDetails from '~/components/CardDetails';

export default {
  components: {
    CardDetails,
  },
  async fetch() {
    const query = {
      set: this.$route.params.set,
      setNum: this.$route.params.number,
    };
    await this.queryCard(query);
  },
  data() {
    return {
      cID: `${this.$route.params.set.toUpperCase()}${this.$route.params.number.toLowerCase()}`,
    };
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
