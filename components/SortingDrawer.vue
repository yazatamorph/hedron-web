<template>
  <div>
    <v-list>
      <v-list-item to="/collection">
        <v-list-item-title>Collection</v-list-item-title>
        <v-list-item-icon><v-icon>mdi-cards</v-icon></v-list-item-icon>
      </v-list-item>

      <v-list-item-group>
        <v-list-item @click="handleOwnFilter">
          <v-list-item-subtitle>Owned</v-list-item-subtitle></v-list-item
        >
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
            <v-list-item-subtitle>CMC</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <v-list-item link
          ><v-list-item-subtitle>0</v-list-item-subtitle></v-list-item
        >
        <v-list-item link
          ><v-list-item-subtitle>1</v-list-item-subtitle></v-list-item
        >
        <v-list-item link
          ><v-list-item-subtitle>2</v-list-item-subtitle></v-list-item
        >
        <v-list-item link
          ><v-list-item-subtitle>3</v-list-item-subtitle></v-list-item
        >
        <v-list-item link
          ><v-list-item-subtitle>4</v-list-item-subtitle></v-list-item
        >
        <v-list-item link>
          <v-list-item-subtitle>5</v-list-item-subtitle></v-list-item
        >
        <v-list-item link>
          <v-list-item-subtitle>6</v-list-item-subtitle></v-list-item
        >
        <v-list-item link>
          <v-list-item-subtitle>7</v-list-item-subtitle></v-list-item
        >
        <v-list-item link>
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
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'SortingDrawer',
  data() {
    return {
      colors: ['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless'],
    };
  },
  computed: {
    ...mapGetters('collection', ['getSets', 'getTags']),
    ...mapState('collection', {
      filterOwnState: (state) => state.filters.own,
      filterWishState: (state) => state.filters.wish,
      filterSetsState: (state) => state.filters.sets,
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
    handleColorFilter(color) {
      this.filterColor({ color });
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
