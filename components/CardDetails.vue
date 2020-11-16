<template>
  <v-row class="mb-md-6 justify-center" no-gutters>
    <v-col cols="12" sm="6" md="4" md-offset="3">
      <v-hover>
        <template v-slot:default="{ hover }">
          <v-img
            class="rounded-card transition-swing"
            :class="`elevation-${hover ? 24 : 10}`"
            :src="cardImage"
          ></v-img>
        </template>
      </v-hover>
    </v-col>
    <v-col cols="12" sm="6" sm-offset="6" md="4" md-offset="7">
      <v-sheet class="my-md-n4 ml-md-n4 py-md-4 pl-md-4 rounded" outlined>
        <v-card-title class="heading">{{ cardName }}</v-card-title>
        <v-card-text>
          I've got a lovely bunch of coconuts, here they are all standing in a
          row. Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
          lovely bunch of coconuts, here they are all standing in a row. Lorem
          ipsum lasciate ogne speranza voi ch'intrate. I've got a lovely bunch
          of coconuts, here they are all standing in a row. Lorem ipsum lasciate
          ogne speranza voi ch'intrate. I've got a lovely bunch of coconuts,
          here they are all standing in a row. Lorem ipsum lasciate ogne
          speranza voi ch'intrate. I've got a lovely bunch of coconuts, here
          they are all standing in a row. Lorem ipsum lasciate ogne speranza voi
          ch'intrate. I've got a lovely bunch of coconuts, here they are all
          standing in a row. Lorem ipsum lasciate ogne speranza voi ch'intrate.
          I've got a lovely bunch of coconuts, here they are all standing in a
          row. Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
          lovely bunch of coconuts, here they are all standing in a row. Lorem
          ipsum lasciate ogne speranza voi ch'intrate.
        </v-card-text>
      </v-sheet>
    </v-col>
    <v-col cols="12" md="3" class="order-md-first">
      <v-sheet class="my-md-n4 mr-md-n4 py-md-4 pr-md-4 rounded" outlined>
        <v-list-item two-line>
          <v-list-item-avatar tile>
            <img :src="setSymbol" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ makeSetString() }}</v-list-item-title>
            <v-list-item-subtitle>{{
              makePrintingInfo()
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="elevation-1 mb-sm-2"></v-divider>
        <div
          class="d-flex flex-column flex-sm-row flex-md-column flex-nowrap flex-sm-wrap flex-md-nowrap justify-start"
        >
          <div v-for="n in 7" :key="n">
            <v-list-item dense>
              <v-list-item-content>
                <v-list-item-subtitle>
                  {{ `${setName} #${printingNumber}` }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CardDetails',
  data() {
    return {
      // setName: 'Masters 25',
      // setNameAbbreviation: 'A25',
      // printingNumber: '50',
      // printingRarity: 'Common',
      // printingLanguage: 'English',
      setSymbol:
        'https://c2.scryfall.com/file/scryfall-symbols/sets/a25.svg?1604898000',
      // cardImage:
      //   'https://c1.scryfall.com/file/scryfall-cards/png/front/c/c/cca8eb95-d071-46a4-885c-3da25b401806.png?1562441143',
    };
  },
  computed: {
    ...mapGetters('cards', [
      'cardImage',
      'cardName',
      'printingLanguage',
      'printingRarity',
      'printingNumber',
      'setNameAbbreviation',
      'setName',
    ]),
  },
  methods: {
    makeSetString() {
      return `${this.setName} (${this.setNameAbbreviation})`;
    },
    makePrintingInfo() {
      return `#${this.printingNumber} | ${this.printingRarity} | ${this.printingLanguage}`;
    },
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
