<template>
  <v-row class="mt-md-4 justify-center" no-gutters>
    <v-col cols="12" md="11" md-offset="1">
      <v-card outlined>
        <v-container>
          <v-row no-gutters>
            <v-col cols="12" class="d-flex flex-nowrap">
              <v-switch
                :value="card.own"
                inset
                class="font-weight-bold ml-5"
                color="teal accent-4"
                label="Owned"
                @change="handleOwn"
              ></v-switch>
              <v-switch
                :value="card.wish"
                inset
                class="font-weight-bold ml-5"
                color="cyan accent-4"
                label="Wishlist"
                @change="handleWish"
              ></v-switch>
            </v-col>
          </v-row>
          <!-- end upper section -->
          <v-expand-transition>
            <div v-show="card.own" height="100" width="100" class="mx-auto">
              <!-- begin lower section -->
              <!-- begin tags, comments, etc. -->
              <v-row class="mt-n6 mb-n10">
                <v-col cols="12" md="4">
                  <v-card-subtitle class="font-weight-medium"
                    >Tags</v-card-subtitle
                  >
                  <v-text-field
                    v-model="tagInput"
                    outlined
                    class="ml-4"
                    placeholder="Enter tags..."
                    @keydown.enter="handleSubmitTag"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="8"
                  ><v-container class="d-flex flex-wrap align-left mr-4">
                    <v-chip
                      v-for="(tag, index) in card.tags"
                      :key="`tagKey${index}`"
                      label
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
                    outlined
                    clearable
                    class="mx-4"
                    placeholder="Enter comments..."
                    @click:clear="handleCommentsClear"
                    @blur="handleCommentsInput"
                    @keyup="debounceComments"
                  ></v-textarea>
                </v-col>
              </v-row>
              <!-- end tags, comments, etc. -->
              <!-- begin counters -->
              <v-row class="d-flex flex-wrap justify-space-around">
                <v-col
                  v-for="con in conditionMap"
                  :key="`colKey.${condition(con)}`"
                  cols="12"
                  md="5"
                  class="mt-n10"
                >
                  <v-card-subtitle class="font-weight-medium">{{
                    condition(con, true)
                  }}</v-card-subtitle>

                  <v-text-field
                    :value="card.condition[condition(con)]"
                    :rules="[rules.quantity]"
                    outlined
                    readonly
                    label="Quantity"
                    class="mb-n2"
                  >
                    <template v-slot:prepend>
                      <v-icon @click="handleQuantity(con, 'add')"
                        >mdi-plus-circle</v-icon
                      >
                    </template>
                    <template v-slot:append-outer>
                      <v-icon @click="handleQuantity(con, 'subtract')"
                        >mdi-minus-circle</v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <!-- end counters -->
              <!-- end lower section -->
            </div>
          </v-expand-transition>
        </v-container>
      </v-card>
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
    num: { type: String, required: true, default: '' },
    setAbbr: { type: String, required: true, default: '' },
  },
  data() {
    return {
      cardInit: {
        set: this.setAbbr,
        num: this.num,
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
      },
      commentInput: '',
      conditionMap: [
        { nm: 'Near Mint' },
        { nmf: 'Near Mint Foil' },
        { lp: 'Lightly Played' },
        { lpf: 'Lightly Played Foil' },
        { mp: 'Moderately Played' },
        { mpf: 'Moderately Played Foil' },
        { hp: 'Heavily Played' },
        { hpf: 'Heavily Played Foil' },
        { dmg: 'Damaged' },
        { dmgf: 'Damaged Foil' },
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
          return this.cardInit;
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
      'enterInCollection',
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
