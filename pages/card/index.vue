<template>
  <v-container>
    <CardDetails />
    <CollectionPanel />
  </v-container>
</template>

<script>
import CardDetails from '../../components/CardDetails';
import CollectionPanel from '../../components/CollectionPanel';

export default {
  components: {
    CardDetails,
    CollectionPanel,
  },
};
</script>
