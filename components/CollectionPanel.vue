<template>
  <v-row class="mt-md-4 justify-center" no-gutters>
    <v-col cols="12" md="11" md-offset="1">
      <v-card outlined>
        <v-container>
          <v-row no-gutters>
            <v-col cols="12" class="d-flex flex-nowrap">
              <v-switch
                :value="owned"
                :input-value="cards[cardIndex].own"
                inset
                class="font-weight-bold ml-5"
                color="teal accent-4"
                label="Owned"
                @change="changeSwitch('own', $event !== null)"
              ></v-switch>
              <v-switch
                value="false"
                :input-value="cards[cardIndex].wish"
                inset
                class="font-weight-bold ml-5"
                color="cyan accent-4"
                label="Wishlist"
                @click="changeSwitch('wish', $event !== null)"
              ></v-switch>
            </v-col>
          </v-row>
          <!-- end upper section -->
          <v-expand-transition>
            <div v-show="owned" height="100" width="100" class="mx-auto">
              <!-- begin lower section -->
              <v-row>
                <!-- begin repeating counters -->
                <v-col md="4">
                  <div
                    v-for="con in conditionMap"
                    :key="`contKey.${condition(con)}`"
                  >
                    <v-card-subtitle class="font-weight-medium">{{
                      condition(con, true)
                    }}</v-card-subtitle>
                    <v-row class="my-n2">
                      <v-col>
                        <div class="d-flex flex-wrap justify-space-between">
                          <v-text-field
                            :value="cards[cardIndex].condition[condition(con)]"
                            :rules="[rules.quantity]"
                            outlined
                            :disabled="!cards[cardIndex].own"
                            label="Quantity"
                            class="mb-n4"
                          >
                            <template v-slot:prepend>
                              <v-icon @click="quantity(con, 'add')"
                                >mdi-plus-circle</v-icon
                              >
                            </template>
                            <template v-slot:append-outer>
                              <v-icon @click="quantity(con, 'subtract')"
                                >mdi-minus-circle</v-icon
                              >
                            </template>
                          </v-text-field>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <!-- end repeating counters -->
                <!-- begin tags, comments, etc. -->
                <v-col>
                  <v-row>
                    <v-col>
                      <v-card-subtitle class="font-weight-medium"
                        >Tags</v-card-subtitle
                      >
                      <v-text-field
                        v-model="tagInput"
                        outlined
                        placeholder="Enter tags..."
                        @keydown.enter="submitTag"
                      ></v-text-field>
                      <v-container class="d-flex flex-wrap align-left">
                        <v-chip
                          v-for="(tag, index) in cards[cardIndex].tags"
                          :key="`tagKey${index}`"
                          close
                          @click:close="removeTag(index)"
                          >{{ tag }}</v-chip
                        >
                      </v-container>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-card-subtitle class="font-weight-medium"
                        >Comments</v-card-subtitle
                      >
                      <v-textarea
                        :label="cards[cardIndex].comments"
                        outlined
                        name="comment-input"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
                <!-- end tags, comments, etc. -->
              </v-row>
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

export default {
  name: 'CollectionPanel',
  data() {
    return {
      conditionMap: [
        { nm: 'Near Mint' },
        { lp: 'Lightly Played' },
        { mp: 'Moderately Played' },
        { hp: 'Heavily Played' },
        { dmg: 'Damaged' },
      ],
      owned: false,
      rules: {
        quantity: (value) =>
          (Number.isInteger(parseInt(value)) && parseInt(value) >= 0) ||
          value === '' ||
          'Quantity must be a positive number!',
      },
      tagInput: '',
    };
  },
  computed: {
    ...mapState('collection', {
      cards: (state) => state.cards,
      cardIndex: (state) => state.cardIndex,
    }),
  },
  methods: {
    ...mapActions('collection', [
      'changeQuantity',
      'changeTags',
      'enterInCollection',
    ]),
    changeSwitch(which, value) {
      const card = {};
      Object.assign(card, this.cards[this.cardIndex], { updated: new Date() });
      card[which] = value;

      this.enterInCollection(card);
      if (which === 'own') {
        this.owned = value;
      }
    },
    condition(con, long) {
      if (long) {
        return Object.values(con)[0];
      }
      return Object.keys(con)[0];
    },
    quantity(con, op) {
      this.changeQuantity({ con: this.condition(con), op });
    },
    removeTag(index) {
      const update = { op: 'delete', tag: index };
      this.changeTags(update);
    },
    submitTag() {
      if (!this.cards[this.cardIndex].tags.includes(this.tagInput)) {
        const update = { op: 'submit', tag: this.tagInput };
        this.changeTags(update);
      }
      this.tagInput = '';
    },
  },
};
</script>
