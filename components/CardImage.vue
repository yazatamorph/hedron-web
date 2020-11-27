<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-img
        class="rounded-card transition-swing"
        :class="`elevation-${hover ? 24 : 10}`"
        :src="imageSource"
      ></v-img>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: 'CardImage',
  props: {
    imageSource: { type: String, required: true, default: '' },
  },
};
</script>

<style scoped>
.rounded-card {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4.75% / 3.5%;
}
</style>
