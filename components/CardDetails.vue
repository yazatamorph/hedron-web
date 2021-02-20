<template>
  <v-row class="mb-md-6 justify-center" no-gutters>
    <v-col cols="12" sm="3">
      <v-row no-gutters>
        <v-col cols="12">
          <CardImage
            :image-source="
              cardFaces && cardFaces.length && cardFaces[0].image_uris
                ? [
                    cardFaces[0].image_uris.normal,
                    cardFaces[1].image_uris.normal,
                  ]
                : [cardImage]
            "
            :alt-text="makeImgAlt()"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-menu
            v-if="cardPrintings && cardPrintings.length"
            transition="scroll-y-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="grey darken-4" dark block v-bind="attrs" v-on="on">
                Printings
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <div v-for="(print, index) in cardPrintings" :key="print.id">
                <v-list-item dense>
                  <v-list-item-content>
                    <nuxt-link
                      :to="`/card/${print.set}/${print.collector_number}`"
                      style="display: inline-block; text-decoration: none"
                    >
                      <v-list-item-subtitle>
                        {{ `${print.set_name} #${print.collector_number}` }}
                      </v-list-item-subtitle>
                    </nuxt-link>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="index < cardPrintings.length - 1"></v-divider>
              </div>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="9">
      <v-sheet color="transparent" dark class="ml-md-n4 pl-md-4 rounded">
        <v-card-title class="text-h6 mb-n6" style="word-break: normal">{{
          cardName
        }}</v-card-title>
        <v-list-item>
          <v-list-item-avatar tile>
            <img class="icon-color" :src="setSymbol" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title style="word-break: normal">{{
              makeSetString()
            }}</v-list-item-title>
            <v-list-item-title>{{ makePrintingInfo() }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <CollectionPanel :card-id="cardId" :set-abbr="setAbbr" :num="num" />
        <!-- <CardTextPanel /> -->
      </v-sheet>
    </v-col>
    <!-- <v-col cols="12" md="5" md-offset="6">
      <v-sheet class="my-md-n4 ml-md-n4 py-md-4 pl-md-4 rounded" outlined>
        <CollectionPanel :card-id="cardId" :set-abbr="setAbbr" :num="num" />
      </v-sheet>
    </v-col> -->
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import CardImage from './CardImage';
// import CardTextPanel from './CardTextPanel';
import CollectionPanel from './CollectionPanel';

export default {
  name: 'CardDetails',
  components: {
    CardImage,
    // CardTextPanel,
    CollectionPanel,
  },
  props: {
    cardId: { type: String, required: true, default: '' },
    num: { type: String, required: true, default: '' },
    setAbbr: { type: String, required: true, default: '' },
  },
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
      'setSymbol',
    ]),
  },
  methods: {
    makeImgAlt() {
      return `${this.cardName} (${this.setNameAbbreviation} #${this.printingNumber})`;
    },
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
.icon-color {
  filter: invert(100%);
  -webkit-filter: invert(100%);
}
</style>
