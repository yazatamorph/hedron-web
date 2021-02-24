<template>
  <div>
    <v-list>
      <v-list-item active-class="white--text" to="/collection">
        <v-list-item-content>
          <v-list-item-title>Collection</v-list-item-title>
        </v-list-item-content>
        <v-icon>mdi-cards</v-icon>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item-group active-class="white--text">
        <v-list-item @click="handleWishFilter">
          <v-list-item-subtitle>Wishlist</v-list-item-subtitle>
        </v-list-item>
      </v-list-item-group>

      <v-list-group active-class="white--text" :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Sets</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-form ref="selectSet">
          <v-radio-group
            v-model="radioSet"
            class="mt-n2 mb-n6"
            dense
            @change="handleSetFilter(radioSet)"
          >
            <v-list-item v-for="(set, i) in getSets" :key="`setInd${i}`"
              ><v-radio :label="set[1]" :value="set[0]"> </v-radio>
            </v-list-item>
          </v-radio-group>
        </v-form>
      </v-list-group>

      <v-list-group active-class="white--text" :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Colors</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-form>
          <v-list-item v-for="(color, i) in colors" :key="`colorInd${i}`"
            ><v-checkbox
              v-model="checkColor"
              class="mt-n2 mb-n3"
              dense
              :color="color[1]"
              :label="color[0]"
              :value="color[0]"
              @change="handleColorFilter(color[0])"
            ></v-checkbox>
          </v-list-item>
        </v-form>
      </v-list-group>

      <v-list-group active-class="white--text" :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Rarity</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-form>
          <v-list-item v-for="(rarity, i) in rarities" :key="`rarityInd${i}`"
            ><v-checkbox
              v-model="checkRarity"
              class="mt-n2 mb-n3"
              dense
              :color="rarity[1]"
              :label="rarity[0]"
              :value="rarity[0]"
              @change="handleRarityFilter(rarity[0])"
            ></v-checkbox>
          </v-list-item>
        </v-form>
      </v-list-group>

      <v-list-group active-class="white--text" :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>CMC</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-form ref="selectCMC">
          <v-radio-group
            v-model="radioCMC"
            class="mt-n2 mb-n6"
            dense
            @change="handleCMCFilter(radioCMC)"
          >
            <v-list-item
              v-for="(n, i) in [0, 1, 2, 3, 4, 5, 6, 7, 8]"
              :key="`cmcInd${i}`"
              ><v-radio :label="n === 8 ? '8+' : n + ''" :value="n"> </v-radio>
            </v-list-item>
          </v-radio-group>
        </v-form>
      </v-list-group>

      <v-list-group active-class="white--text" :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Tags</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-container>
          <v-chip-group
            v-model="chipTags"
            active-class="pink--text text--lighten-4"
            multiple
            column
          >
            <v-chip
              v-for="(tag, i) in getTags"
              :key="`tagInd${i}`"
              :value="tag"
              color="grey darken-4"
              @change="handleTagFilter(tag)"
              >{{ tag }}</v-chip
            >
          </v-chip-group>
        </v-container>
      </v-list-group>

      <v-list-item v-if="displayReset()" @click="handleResetFilters">
        <v-list-item-subtitle>Reset Filters</v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <SyncSettings />
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import SyncSettings from '~/components/SyncSettings';

export default {
  name: 'SortingDrawer',
  components: {
    SyncSettings,
  },
  data() {
    return {
      colors: [
        ['White', 'white'],
        ['Blue', 'light-blue darken-1'],
        ['Black', 'grey darken-1'],
        ['Red', 'red darken-1'],
        ['Green', 'green darken-1'],
        ['Colorless', 'grey lighten-1'],
      ],
      checkColor: [],
      checkRarity: [],
      chipTags: [],
      radioSet: undefined,
      radioCMC: undefined,
      rarities: [
        ['Mythic Rare', 'deep-orange accent-2'],
        ['Rare', 'amber lighten-3'],
        ['Uncommon', 'grey lighten-2'],
        ['Common', 'grey darken-1'],
      ],
    };
  },
  computed: {
    ...mapGetters('collection', ['getSets', 'getTags']),
    ...mapState('collection', {
      filterOwnState: (state) => state.filters.own,
      filterWishState: (state) => state.filters.wish,
      filterSetsState: (state) => state.filters.sets,
      filterRarityState: (state) => state.filters.rarity,
      filterColorsState: (state) => state.filters.colors,
      filterCMCState: (state) => state.filters.cmc,
      filterTagsState: (state) => state.filters.tags,
    }),
  },
  methods: {
    ...mapActions('collection', [
      'filterCMC',
      'filterColor',
      'filterOwn',
      'filterRarity',
      'filterSet',
      'filterTag',
      'filterWish',
      'filterResetAll',
    ]),
    handleOwnFilter() {
      this.filterOwn();
    },
    handleWishFilter() {
      this.filterWish();
    },
    handleSetFilter(set) {
      this.filterSet({ set });
    },
    handleCMCFilter(cmc) {
      this.filterCMC({ cmc });
    },
    handleColorFilter(color) {
      this.filterColor({ color });
    },
    handleRarityFilter(rarity) {
      this.filterRarity({ rarity });
    },
    handleTagFilter(tag) {
      this.filterTag({ tag });
    },
    handleResetFilters() {
      this.filterResetAll();
      if (this.$refs.selectSet) {
        this.$refs.selectSet.reset();
      }
      if (this.$refs.selectCMC) {
        this.$refs.selectCMC.reset();
      }
      this.checkColor = [];
      this.checkRarity = [];
      this.chipTags = [];
    },
    displayReset() {
      if (
        !this.filterOwnState ||
        this.filterWishState ||
        this.filterSetsState ||
        this.filterRarityState.length ||
        this.filterColorsState.length ||
        typeof this.filterCMCState === 'number' ||
        this.filterTagsState.length
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>
