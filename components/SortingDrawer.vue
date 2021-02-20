<template>
  <div>
    <v-list>
      <v-list-item to="/collection">
        <v-list-item-content>
          <v-list-item-title>Collection</v-list-item-title>
        </v-list-item-content>

        <v-icon>mdi-cards</v-icon>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item-group>
        <!-- <v-list-item @click="handleOwnFilter">
          <v-list-item-subtitle>Owned</v-list-item-subtitle></v-list-item
        > -->
        <v-list-item @click="handleWishFilter"
          ><v-list-item-subtitle>Wishlist</v-list-item-subtitle></v-list-item
        >
      </v-list-item-group>
      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Sets</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(set, i) in getSets"
          :key="`setInd${i}`"
          @click="handleSetFilter(set)"
        >
          <v-list-item-subtitle>{{
            set.toUpperCase()
          }}</v-list-item-subtitle></v-list-item
        >
      </v-list-group>
      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Colors</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(color, i) in colors"
          :key="`colorInd${i}`"
          @click="handleColorFilter(color)"
          ><v-list-item-subtitle>{{ color }}</v-list-item-subtitle></v-list-item
        >
      </v-list-group>
      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Rarity</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(rarity, i) in rarities"
          :key="`rarityInd${i}`"
          @click="handleRarityFilter(rarity)"
          ><v-list-item-subtitle>{{
            rarity
          }}</v-list-item-subtitle></v-list-item
        >
      </v-list-group>
      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>CMC</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-list-item @click="handleCMCFilter(0)"
          ><v-list-item-subtitle>0</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(1)"
          ><v-list-item-subtitle>1</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(2)"
          ><v-list-item-subtitle>2</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(3)"
          ><v-list-item-subtitle>3</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(4)"
          ><v-list-item-subtitle>4</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(5)">
          <v-list-item-subtitle>5</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(6)">
          <v-list-item-subtitle>6</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(7)">
          <v-list-item-subtitle>7</v-list-item-subtitle></v-list-item
        >
        <v-list-item @click="handleCMCFilter(8)">
          <v-list-item-subtitle>8+</v-list-item-subtitle></v-list-item
        >
      </v-list-group>
      <v-list-group :value="false" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-subtitle>Tags</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(tag, i) in getTags"
          :key="`tagInd${i}`"
          @click="handleTagFilter(tag)"
        >
          <v-list-item-subtitle>{{ tag }}</v-list-item-subtitle></v-list-item
        >
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
      colors: ['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless'],
      rarities: ['Mythic Rare', 'Rare', 'Uncommon', 'Common'],
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
    },
    displayReset() {
      if (
        !this.filterOwnState ||
        this.filterWishState ||
        this.filterSetsState ||
        this.filterRarityState.length ||
        this.filterColorsState.length ||
        this.filterCMCState ||
        this.filterTagsState.length
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>