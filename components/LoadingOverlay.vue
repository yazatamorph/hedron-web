<template>
  <v-overlay :value="displaying">
    <v-progress-circular indeterminate size="64" color="grey lighten-5"
      ><v-img max-height="48" max-width="48" src="/hedron.png"></v-img
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    displaying: { type: Boolean, required: true, default: false },
  },
};
</script>
