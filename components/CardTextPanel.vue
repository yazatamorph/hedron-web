<template>
  <v-container class="px-1">
    <!-- begin double-face card -->
    <div v-if="cardFaces && cardFaces.length">
      <div v-for="(face, index) of cardFaces" :key="`faceIndex${index}`">
        <v-card-text v-if="face.name" class="text-body-1 my-n4">{{
          face.name
        }}</v-card-text>
        <component
          :is="injectSymbols(face.mana_cost)"
          v-if="face.mana_cost"
          class="d-flex flex-nowrap justify-start"
        ></component>
        <v-card-text v-if="face.type_line" class="text-body-2 my-n4">{{
          face.type_line
        }}</v-card-text>
        <component
          :is="injectSymbols(face.oracle_text)"
          v-if="face.oracle_text"
          class="d-flex flex-nowrap justify-start"
          style="white-space: pre-line"
        ></component>
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
      <component
        :is="injectSymbols(cardManaCost)"
        v-if="cardManaCost"
        class="d-flex flex-nowrap justify-start"
      ></component>
      <v-card-text v-if="cardTypes" class="text-body-2 my-n4">{{
        cardTypes
      }}</v-card-text>
      <v-card-text
        :is="injectSymbols(cardOracle)"
        v-if="cardOracle"
        class="d-flex flex-nowrap justify-start"
        style="white-space: pre-line"
      ></v-card-text>
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
import _ from 'lodash';

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
  methods: {
    injectSymbols(text) {
      const symbols = [
        [/\{T\}/g, 'T'],
        [/\{Q\}/g, 'Q'],
        [/\{E\}/g, 'E'],
        [/\{PW\}/g, 'PW'],
        [/\{CHAOS\}/g, 'CHAOS'],
        [/\{A\}/g, 'A'],
        [/\{X\}/g, 'X'],
        [/\{Y\}/g, 'Y'],
        [/\{Z\}/g, 'Z'],
        [/\{0\}/g, '0'],
        [/\{½\}/g, 'HALF'],
        [/\{1\}/g, '1'],
        [/\{2\}/g, '2'],
        [/\{3\}/g, '3'],
        [/\{4\}/g, '4'],
        [/\{5\}/g, '5'],
        [/\{6\}/g, '6'],
        [/\{7\}/g, '7'],
        [/\{8\}/g, '8'],
        [/\{9\}/g, '9'],
        [/\{10\}/g, '10'],
        [/\{11\}/g, '11'],
        [/\{12\}/g, '12'],
        [/\{13\}/g, '13'],
        [/\{14\}/g, '14'],
        [/\{15\}/g, '15'],
        [/\{16\}/g, '16'],
        [/\{17\}/g, '17'],
        [/\{18\}/g, '18'],
        [/\{19\}/g, '19'],
        [/\{20\}/g, '20'],
        [/\{100\}/g, '100'],
        [/\{1000000\}/g, '1000000'],
        [/\{∞\}/g, 'INFINITY'],
        [/\{W\/U\}/g, 'WU'],
        [/\{W\/B\}/g, 'WB'],
        [/\{B\/R\}/g, 'BR'],
        [/\{B\/G\}/g, 'BG'],
        [/\{U\/B\}/g, 'UB'],
        [/\{U\/R\}/g, 'UR'],
        [/\{R\/G\}/g, 'RG'],
        [/\{R\/W\}/g, 'RW'],
        [/\{G\/W\}/g, 'GW'],
        [/\{G\/U\}/g, 'GU'],
        [/\{2\/W\}/g, '2W'],
        [/\{2\/U\}/g, '2U'],
        [/\{2\/B\}/g, '2B'],
        [/\{2\/R\}/g, '2R'],
        [/\{2\/G\}/g, '2G'],
        [/\{P\}/g, 'P'],
        [/\{W\/P\}/g, 'WP'],
        [/\{U\/P\}/g, 'UP'],
        [/\{B\/P\}/g, 'BP'],
        [/\{R\/P\}/g, 'RP'],
        [/\{G\/P\}/g, 'GP'],
        [/\{HW\}/g, 'HW'],
        [/\{HR\}/g, 'HR'],
        [/\{W\}/g, 'W'],
        [/\{U\}/g, 'U'],
        [/\{B\}/g, 'B'],
        [/\{R\}/g, 'R'],
        [/\{G\}/g, 'G'],
        [/\{C\}/g, 'C'],
        [/\{S\}/g, 'S'],
      ];

      let newString = text;
      symbols.forEach((sym) => {
        newString = _.replace(
          newString,
          sym[0],
          '<v-img max-height="16" max-width="16" alt="' +
            sym[1] +
            ' mana symbol" src="/card-symbols/' +
            sym[1] +
            '.svg"></v-img>'
        );
      });

      return {
        template:
          '<v-card-text class="text-body-2 my-n4 justify-start">' +
          newString +
          '</v-card-text>',
      };
    },
  },
};
</script>
