<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-wrap flex-md-nowrap justify-center">
          <div class="mx-md-n3 card-parent">
            <v-img class="elevation-18 rounded-card" :src="cardImage"></v-img>
          </div>
          <v-sheet
            min-width="300px"
            max-width="600px"
            class="my-md-n4 ml-md-n2 py-md-4 pl-md-6 rounded"
            outlined
          >
            <v-card-title class="heading">Card Name</v-card-title>
            <v-card-text>
              I've got a lovely bunch of coconuts, here they are all standing in
              a row. Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got
              a lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate.
            </v-card-text>
          </v-sheet>
          <v-sheet
            min-width="300px"
            max-width="350px"
            class="order-md-first my-md-n4 mr-md-n2 py-md-4 pr-md-6 rounded"
            outlined
          >
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

            <v-divider></v-divider>
            <!-- <v-card-title class="heading">Printings!</v-card-title>
            <v-card-text>
              I've got a lovely bunch of coconuts, here they are all standing in
              a row. Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got
              a lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate.
            </v-card-text> -->
          </v-sheet>
        </div>
      </v-col>
    </v-row>
    <v-sheet class="mt-md-4 pa-4">
      <v-row>
        <v-col v-for="n in 2" :key="n" cols="12" sm="4">
          <v-container> Collection Info Stuff! </v-container>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'CardDetails',
  data() {
    return {
      setName: 'Masters 25',
      setNameAbbreviation: 'A25',
      printingNumber: '50',
      printingRarity: 'Common',
      printingLanguage: 'English',
      setSymbol:
        'https://c2.scryfall.com/file/scryfall-symbols/sets/a25.svg?1604898000',
      cardImage:
        'https://c1.scryfall.com/file/scryfall-cards/png/front/c/c/cca8eb95-d071-46a4-885c-3da25b401806.png?1562441143',
    };
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
.card-parent {
  max-width: 300px;
}
.rounded-card {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4.75% / 3.5%;
}
</style>
