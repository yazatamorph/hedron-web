<template>
  <v-row class="mt-md-4 justify-center" no-gutters>
    <v-col cols="12" md="11" md-offset="1">
      <v-card outlined>
        <v-container>
          <v-row no-gutters>
            <v-col cols="12" class="d-flex flex-nowrap">
              <v-switch
                v-model="collection.owned"
                inset
                class="font-weight-bold ml-5"
                color="teal accent-4"
                label="Owned"
              ></v-switch>
              <v-switch
                v-model="collection.wishlist"
                inset
                class="font-weight-bold ml-5"
                color="cyan accent-4"
                label="Wishlist"
              ></v-switch>
            </v-col>
          </v-row>
          <v-expand-transition>
            <div
              v-show="collection.owned"
              height="100"
              width="100"
              class="mx-auto"
            >
              <div
                v-for="con in conditionMap"
                :key="`contKey.${condition(con)}`"
              >
                <v-card-subtitle class="font-weight-medium">{{
                  condition(con, true)
                }}</v-card-subtitle>
                <v-row class="my-n2">
                  <v-col cols="12">
                    <div class="d-flex flex-wrap justify-space-between">
                      <v-text-field
                        v-model="collection[condition(con)].quantity"
                        :rules="[rules.quantity]"
                        outlined
                        :disabled="!collection.owned"
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
            </div>
          </v-expand-transition>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
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
      collection: {
        owned: true,
        wishlist: false,
        nm: {
          quantity: 0,
        },
        lp: {
          quantity: 2,
        },
        mp: {
          quantity: 5,
        },
        hp: {
          quantity: 0,
        },
        dmg: {
          quantity: 0,
        },
      },
      rules: {
        quantity: (value) =>
          (Number.isInteger(parseInt(value)) && parseInt(value) >= 0) ||
          value === '' ||
          'Quantity must be a positive number!',
      },
    };
  },
  methods: {
    condition(con, long) {
      if (long) {
        return Object.values(con)[0];
      }
      return Object.keys(con)[0];
    },
    quantity(con, op) {
      if (op === 'add') {
        if (this.collection[this.condition(con)].quantity >= 0) {
          this.collection[this.condition(con)].quantity++;
          return;
        }
        this.collection[this.condition(con)].quantity = 1;
      } else if (op === 'subtract') {
        if (this.collection[this.condition(con)].quantity > 0) {
          this.collection[this.condition(con)].quantity--;
          return;
        }
        this.collection[this.condition(con)].quantity = 0;
      }
    },
  },
};
</script>
