<template>
  <v-row class="mb-md-6 justify-center" no-gutters>
    <v-col cols="12" sm="3">
      <v-row no-gutters>
        <v-col cols="12">
          <CardImage
            :image-source="
              card.card_faces &&
              card.card_faces.length &&
              card.card_faces[0].image_uris
                ? [
                    card.card_faces[0].image_uris.normal,
                    card.card_faces[1].image_uris.normal,
                  ]
                : [card.image_uris.normal]
            "
            :alt-text="makeImgAlt()"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="prints && prints.length" cols="12">
          <v-card v-if="$vuetify.breakpoint.lgAndUp">
            <v-list>
              <v-list-item>
                <v-list-item-title>Printings</v-list-item-title>
              </v-list-item>
              <v-virtual-scroll
                bench="5"
                :items="prints"
                max-height="200"
                :item-height="40"
              >
                <template v-slot:default="{ item }">
                  <v-list-item dense>
                    <v-list-item-content>
                      <nuxt-link
                        :to="`/card/${item.set}/${item.collector_number}`"
                        style="display: inline-block; text-decoration: none"
                      >
                        <v-list-item-subtitle>
                          {{ `${item.set_name} #${item.collector_number}` }}
                        </v-list-item-subtitle>
                      </nuxt-link>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider
                    v-if="prints.indexOf(item) < prints.length - 1"
                  ></v-divider>
                </template>
              </v-virtual-scroll>
            </v-list>
          </v-card>
          <v-menu
            v-else-if="$vuetify.breakpoint.mdAndDown"
            transition="scroll-y-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="grey darken-4" dark block v-bind="attrs" v-on="on">
                Printings
                <v-icon right>{{ icon.menuDown }}</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-virtual-scroll
                bench="5"
                :items="prints"
                max-height="200"
                :item-height="40"
              >
                <template v-slot:default="{ item }">
                  <v-list-item dense>
                    <v-list-item-content>
                      <nuxt-link
                        :to="`/card/${item.set}/${item.collector_number}`"
                        style="display: inline-block; text-decoration: none"
                      >
                        <v-list-item-subtitle>
                          {{ `${item.set_name} #${item.collector_number}` }}
                        </v-list-item-subtitle>
                      </nuxt-link>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider
                    v-if="prints.indexOf(item) < prints.length - 1"
                  ></v-divider>
                </template>
              </v-virtual-scroll>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="9">
      <v-sheet color="transparent" dark class="ml-md-n4 pl-md-4 rounded">
        <v-card-title class="text-h6 mb-n6" style="word-break: normal">{{
          card.name
        }}</v-card-title>
        <v-list-item>
          <v-list-item-avatar tile>
            <img class="icon-color" :src="setSymbol" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title style="word-break: normal">{{
              card.type_line
            }}</v-list-item-title>
            <v-list-item-title>{{ makePrintingInfo() }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <CollectionPanel :card-id="cardId" :card-data="card" />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import _ from 'lodash';
import { mdiMenuDown } from '@mdi/js';
import CardImage from './CardImage';
import CollectionPanel from './CollectionPanel';

export default {
  name: 'CardDetails',
  components: {
    CardImage,
    CollectionPanel,
  },
  props: {
    cardId: { type: String, required: true, default: '' },
    card: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
    prints: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    setSymbol: { type: String, required: true, default: '' },
  },
  data() {
    return {
      icon: {
        menuDown: mdiMenuDown,
      },
    };
  },
  methods: {
    makeImgAlt() {
      return `${this.card.name} (${_.toUpper(this.card.set)} #${
        this.card.collector_number
      })`;
    },
    makePrintingInfo() {
      return `${this.card.set_name} (${_.toUpper(this.card.set)}) #${
        this.card.collector_number
      } | ${_.capitalize(this.card.rarity)}`;
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
