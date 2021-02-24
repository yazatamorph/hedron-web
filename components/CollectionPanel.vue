<template>
  <v-row class="justify-center" no-gutters>
    <v-col cols="12">
      <div>
        <v-row no-gutters>
          <v-col cols="12" class="d-flex flex-nowrap">
            <v-switch
              :input-value="card.own"
              class="font-weight-bold ml-5"
              color="white"
              label="Owned"
              @change="handleOwn"
            ></v-switch>
            <v-switch
              :input-value="card.wish"
              class="font-weight-bold ml-5"
              color="white"
              label="Wishlist"
              @change="handleWish"
            ></v-switch>
          </v-col>
        </v-row>
        <!-- end upper section -->
        <!-- begin lower section -->
        <!-- begin counters -->
        <v-row class="d-flex flex-wrap justify-space-around" no-gutters>
          <v-col
            cols="12"
            sm="6"
            class="px-md-4 d-flex flex-wrap justify-space-around"
          >
            <v-card v-if="cardData.nonfoil">
              <v-row class="d-flex flex-wrap justify-space-around" no-gutters>
                <v-card-title class="text-h6 mt-n2 mb-n2"
                  >Non-Foil</v-card-title
                >
              </v-row>
              <v-row class="d-flex flex-wrap justify-space-around">
                <v-col
                  v-for="con in conditionMap"
                  :key="`colKey.${condition(con)}`"
                  cols="12"
                  sm="6"
                  class="mt-n6"
                >
                  <v-card-subtitle class="mb-n5 font-weight-medium">{{
                    condition(con, true)
                  }}</v-card-subtitle>
                  <v-container>
                    <v-text-field
                      :value="card.condition[condition(con)]"
                      :rules="[rules.quantity]"
                      :disabled="!card.own"
                      readonly
                      rounded
                      light
                      solo
                      flat
                      dense
                      class="centered-input mb-n7"
                    >
                      <template v-slot:prepend-inner>
                        <v-btn
                          icon
                          :disabled="!card.own"
                          @click="handleQuantity(con, 'add')"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append>
                        <v-btn
                          icon
                          :disabled="!card.own"
                          @click="handleQuantity(con, 'subtract')"
                        >
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-container>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              v-else
              class="d-flex align-center justify-center pa-6 pa-sm-10 pa-md-14 mx-auto"
            >
              <v-card-subtitle class="text-subtitle-2 text-center"
                ><em
                  >This printing does not include a non-foil version.</em
                ></v-card-subtitle
              >
            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            class="px-md-4 d-flex flex-wrap justify-space-around"
          >
            <v-card v-if="cardData.foil">
              <v-row class="d-flex flex-wrap justify-space-around" no-gutters>
                <v-card-title class="text-h6 mt-n2 mb-n2">Foil</v-card-title>
              </v-row>
              <v-row class="d-flex flex-wrap justify-space-around">
                <v-col
                  v-for="con in conditionMapFoil"
                  :key="`colKey.${condition(con)}`"
                  cols="12"
                  sm="6"
                  class="mt-n6"
                >
                  <v-card-subtitle class="mb-n5 font-weight-medium">{{
                    condition(con, true)
                  }}</v-card-subtitle>
                  <v-container>
                    <v-text-field
                      :value="card.condition[condition(con)]"
                      :rules="[rules.quantity]"
                      :disabled="!card.own"
                      readonly
                      rounded
                      light
                      solo
                      flat
                      dense
                      class="centered-input mb-n7"
                    >
                      <template v-slot:prepend-inner>
                        <v-btn
                          icon
                          :disabled="!card.own"
                          @click="handleQuantity(con, 'add')"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:append>
                        <v-btn
                          icon
                          :disabled="!card.own"
                          @click="handleQuantity(con, 'subtract')"
                        >
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-container>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              v-else
              class="d-flex align-center justify-center pa-6 pa-sm-10 pa-md-14 mx-auto"
            >
              <v-card-subtitle class="text-subtitle-2 text-center"
                ><em
                  >This printing does not include a foil version.</em
                ></v-card-subtitle
              >
            </v-card>
          </v-col>
        </v-row>
        <!-- end counters -->
        <!-- begin tags, comments, etc. -->
        <v-row class="mt-n2 mb-n10">
          <v-col cols="12" sm="4">
            <v-card-subtitle class="font-weight-medium">Tags</v-card-subtitle>
            <v-text-field
              v-model="tagInput"
              solo
              flat
              :disabled="!card.own"
              class="ml-4 mr-4 mr-md-0"
              placeholder="Enter tags..."
              @keydown.enter="handleSubmitTag"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="8"
            ><v-container class="d-flex flex-wrap align-left mr-4">
              <v-chip
                v-for="(tag, index) in card.tags"
                :key="`tagKey${index}`"
                color="grey darken-4"
                close
                class="ma-1"
                @click:close="handleRemoveTag(index)"
                >{{ tag }}</v-chip
              >
            </v-container></v-col
          >
        </v-row>
        <v-row class="mb-2">
          <v-col>
            <v-card-subtitle class="font-weight-medium"
              >Comments</v-card-subtitle
            >
            <v-textarea
              :value="card.comments"
              solo
              flat
              clearable
              :disabled="!card.own"
              class="mx-4"
              placeholder="Enter comments..."
              @click:clear="handleCommentsClear"
              @blur="handleCommentsInput"
              @keyup="debounceComments"
            ></v-textarea>
          </v-col>
        </v-row>
        <!-- end tags, comments, etc. -->
        <!-- end lower section -->
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import debounce from 'lodash/debounce';

export default {
  name: 'CollectionPanel',
  props: {
    cardId: { type: String, required: true, default: '' },
    cardData: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      commentInput: '',
      conditionMap: [
        { nm: 'Near Mint' },
        { lp: 'Lightly Played' },
        { mp: 'Moderately Played' },
        { hp: 'Heavily Played' },
        { dmg: 'Damaged' },
      ],
      conditionMapFoil: [
        { nmf: 'Near Mint' },
        { lpf: 'Lightly Played' },
        { mpf: 'Moderately Played' },
        { hpf: 'Heavily Played' },
        { dmgf: 'Damaged' },
      ],
      rules: {
        quantity: (value) =>
          (Number.isInteger(parseInt(value)) && parseInt(value) >= 0) ||
          value === '' ||
          'Quantity must be a positive number!',
      },
      tagInput: '',
      debounceComments: debounce(this.handleCommentsInput, 800),
    };
  },
  computed: {
    ...mapState('collection', {
      cards: (state) => state.cards,
      card(state) {
        if (!state.cards[this.cardId]) {
          const newCard = {
            setNumAbbr: this.cardId,
            collector_number: this.cardData.collector_number,
            name: this.cardData.name,
            set: this.cardData.set,
            set_name: this.cardData.set_name,
            color_identity: this.cardData.color_identity,
            rarity: this.cardData.rarity,
            cmc: this.cardData.cmc,
            own: false,
            wish: false,
            condition: {
              nm: 0,
              lp: 0,
              mp: 0,
              hp: 0,
              dmg: 0,
              nmf: 0,
              lpf: 0,
              mpf: 0,
              hpf: 0,
              dmgf: 0,
            },
            tags: [],
            comments: '',
          };

          if (this.cardData.image_uris && this.cardData.image_uris.normal) {
            newCard.image_uris = this.cardData.image_uris;
          }
          if (
            this.cardData.card_faces &&
            this.cardData.card_faces.length &&
            this.cardData.card_faces[0].image_uris
          ) {
            newCard.card_faces = this.cardData.card_faces;
          }

          return newCard;
        }
        return state.cards[this.cardId];
      },
    }),
  },
  methods: {
    ...mapActions('collection', [
      'changeComments',
      'changeOwn',
      'changeQuantity',
      'changeTags',
      'changeWish',
    ]),

    condition(con, long) {
      if (long) {
        return Object.values(con)[0];
      }
      return Object.keys(con)[0];
    },

    handleCommentsInput(e) {
      if (e.target.value === this.card.comments) {
        return;
      }
      this.changeComments({ cID: this.cardId, text: e.target.value });
    },

    handleCommentsClear(e) {
      e.target.value = '';
      this.changeComments({ cID: this.cardId, text: e.target.value });
    },

    handleOwn() {
      this.changeOwn({ cID: this.cardId, cardData: this.card });
    },

    handleQuantity(con, op) {
      this.changeQuantity({ cID: this.cardId, con: this.condition(con), op });
    },

    handleRemoveTag(index) {
      this.changeTags({ cID: this.cardId, op: 'delete', tag: index });
    },

    handleSubmitTag() {
      if (!this.card.tags.includes(this.tagInput)) {
        this.changeTags({ cID: this.cardId, op: 'submit', tag: this.tagInput });
      }
      this.tagInput = '';
    },

    handleWish() {
      this.changeWish({ cID: this.cardId, cardData: this.card });
    },
  },
};
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
.card-outline {
  outline: 2px solid #ffffff;
}
</style>
