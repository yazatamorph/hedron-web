<template>
  <v-container class="px-1">
    <!-- begin double-face card -->
    <div v-if="cardFaces && cardFaces.length">
      <div v-for="(face, index) of cardFaces" :key="`faceIndex${index}`">
        <v-card-text v-if="face.name" class="text-body-1 my-n4">{{
          face.name
        }}</v-card-text>
        <v-card-text v-if="face.mana_cost" class="text-body-2 my-n4">{{
          face.mana_cost
        }}</v-card-text>
        <v-card-text v-if="face.type_line" class="text-body-2 my-n4">{{
          face.type_line
        }}</v-card-text>
        <v-card-text
          v-if="face.oracle_text"
          class="text-body-2 my-n4"
          style="white-space: pre-line"
          >{{ face.oracle_text }}</v-card-text
        >
        <v-card-text
          v-if="face.power && face.toughness"
          class="text-body-2 my-n4"
          >{{ face.power }}/{{ face.toughness }}</v-card-text
        >
        <v-card-text v-if="face.loyalty" class="text-body-2 my-n4"
          >Loyalty: {{ face.loyalty }}</v-card-text
        >
        <v-card-text v-if="face.artist" class="text-body-2 my-n4"
          >Illustrated by {{ face.artist }}.</v-card-text
        >
        <v-divider v-if="index === 0" class="my-4"></v-divider>
      </div>
    </div>
    <!-- end double-face card -->
    <!-- begin single-face card -->
    <div v-else>
      <v-card-text v-if="cardManaCost" class="text-body-2 my-n4">{{
        cardManaCost
      }}</v-card-text>
      <v-card-text v-if="cardTypes" class="text-body-2 my-n4">{{
        cardTypes
      }}</v-card-text>
      <v-card-text
        v-if="cardOracle"
        class="text-body-2 my-n4"
        style="white-space: pre-line"
        >{{ cardOracle }}</v-card-text
      >
      <v-card-text
        v-if="cardCreaturePower && cardCreatureTough"
        class="text-body-2 my-n4"
        >{{ cardCreaturePower }}/{{ cardCreatureTough }}</v-card-text
      >
      <v-card-text v-if="cardPlanesLoyalty" class="text-body-2 my-n4"
        >Loyalty: {{ cardPlanesLoyalty }}</v-card-text
      >
      <v-card-text
        v-if="cardFaces && cardFaces.length"
        class="text-body-2 my-n4"
        >Flip Side</v-card-text
      >
      <v-card-text v-if="cardArtist" class="text-body-2 my-n4"
        >Illustrated by {{ cardArtist }}.</v-card-text
      >
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CardTextPanel',
  computed: {
    ...mapGetters('cards', [
      'cardArtist',
      'cardCreaturePower',
      'cardCreatureTough',
      'cardFaces',
      'cardImage',
      'cardManaCost',
      'cardName',
      'cardOracle',
      'cardPlanesLoyalty',
      'cardPrintings',
      'cardTypes',
      'printingLanguage',
      'printingRarity',
      'printingNumber',
      'setNameAbbreviation',
      'setName',
    ]),
  },
};
</script>
