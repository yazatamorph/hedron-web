import Vue from 'vue';
import sortBy from 'lodash/sortBy';

export const state = () => ({
  cards: {},
  updated: '',
  synched: '',
  synchronizing: false,
  autoSync: false,
  filters: {
    own: true,
    wish: false,
    sets: '',
    colors: [],
    rarity: [],
    cmc: null,
    tags: [],
  },
});

export const getters = {
  getAllCards: (state) => state.cards,
  getSets: (state) => {
    const sets = [];
    Object.keys(state.cards).forEach((card) => {
      if (
        !sets.find((elem) => elem[0] === state.cards[card].set) &&
        state.cards[card].set &&
        ((state.cards[card].own &&
          state.cards[card].own === state.filters.own) ||
          (state.cards[card].wish &&
            state.cards[card].wish === state.filters.wish))
      ) {
        sets.push([state.cards[card].set, state.cards[card].set_name]);
      }
    });
    return sortBy(sets, function (i) {
      return i[1];
    });
  },
  getTags: (state) => {
    const tags = [];
    Object.keys(state.cards).forEach((card) => {
      state.cards[card].tags.forEach((tag) => {
        if (!tags.includes(tag) && tag) {
          tags.push(tag);
        }
      });
    });
    return sortBy(tags, function (i) {
      return i;
    });
  },
  timeSinceSync: (state) => {
    if (!state.synched || !state.updated) {
      return 0;
    } else {
      return Date.parse(state.updated) - Date.parse(state.synched);
    }
  },
};

export const actions = {
  addToCollection({ commit }, { cID, cardData, op }) {
    // op = 'own' or 'wish'
    cardData[op] = true;

    commit('UPDATE_COLLECTION', { cID, cardData });
    commit('UPDATE_TIMESTAMP');
  },

  changeAutoSync({ commit }, bool) {
    commit('UPDATE_AUTO_SYNC', bool);
  },

  changeComments({ commit }, { cID, text }) {
    commit('COMMENT_SUBMIT', { cID, text });
    commit('UPDATE_TIMESTAMP', cID);
  },

  changeOwn({ commit, dispatch, state }, { cID, cardData }) {
    if (!state.cards[cID]) {
      dispatch('addToCollection', { cID, cardData, op: 'own' });
    } else {
      commit('OWN_SWITCH', cID);
      commit('UPDATE_TIMESTAMP', cID);
    }
  },

  changeQuantity({ commit }, { cID, con, op }) {
    if (op === 'add') {
      commit('QUANTITY_INCREMENT', { cID, con });
    } else if (op === 'subtract') {
      commit('QUANTITY_DECREMENT', { cID, con });
    }
    commit('UPDATE_TIMESTAMP', cID);
  },

  changeTags({ commit }, { cID, tag, op }) {
    if (op === 'submit') {
      commit('TAG_SUBMIT', { cID, tag });
    }
    if (op === 'delete') {
      commit('TAG_DELETE', { cID, tag });
    }
    commit('UPDATE_TIMESTAMP', cID);
  },

  changeWish({ commit, dispatch, state }, { cID, cardData }) {
    if (!state.cards[cID]) {
      dispatch('addToCollection', { cID, cardData, op: 'wish' });
    } else {
      commit('WISH_SWITCH', cID);
      commit('UPDATE_TIMESTAMP', cID);
    }
  },

  clearCollection({ commit }) {
    commit('CLEAR_COLLECTION');
    commit('FILTER_RESET_ALL');
  },

  filterCMC({ commit, state }, { cmc }) {
    if (state.filters.cmc === cmc) {
      commit('FILTER_CMC_REMOVE');
    } else {
      commit('FILTER_CMC_ADD', cmc);
    }
  },

  filterColor({ commit, state }, { color }) {
    let abbr;
    switch (color) {
      case 'White':
        abbr = 'W';
        break;
      case 'Blue':
        abbr = 'U';
        break;
      case 'Black':
        abbr = 'B';
        break;
      case 'Red':
        abbr = 'R';
        break;
      case 'Green':
        abbr = 'G';
        break;
      case 'Colorless':
        abbr = 'colorless';
        break;
    }

    if (state.filters.colors.includes(abbr)) {
      commit('FILTER_COLOR_REMOVE', abbr);
    } else {
      commit('FILTER_COLOR_ADD', abbr);
    }
  },

  filterOwn({ commit }) {
    commit('FILTER_OWN');
  },

  filterRarity({ commit, state }, { rarity }) {
    let abbr;
    if (rarity === 'Mythic Rare') {
      abbr = 'mythic';
    } else {
      abbr = rarity.toLowerCase();
    }

    if (state.filters.rarity.includes(abbr)) {
      commit('FILTER_RARITY_REMOVE', abbr);
    } else {
      commit('FILTER_RARITY_ADD', abbr);
    }
  },

  filterResetAll({ commit }) {
    commit('FILTER_RESET_ALL');
  },

  filterSet({ commit, state }, { set }) {
    if (state.filters.sets === set) {
      commit('FILTER_SET_REMOVE');
    } else {
      commit('FILTER_SET_ADD', set);
    }
  },

  filterTag({ commit, state }, { tag }) {
    if (state.filters.tags.includes(tag)) {
      commit('FILTER_TAG_REMOVE', tag);
    } else {
      commit('FILTER_TAG_ADD', tag);
    }
  },

  filterWish({ commit }) {
    commit('FILTER_WISH');
  },

  async syncWithDb({ commit, state, rootState }, update) {
    try {
      const cards =
        update && update.length
          ? update
          : Object.values(state.cards).filter(
              (card) => card.set && card.collector_number
            );
      commit('SYNC_IN_PROGRESS');

      const data = await this.$axios.$post(
        'http://localhost:3420/api/collection/sync/db',
        {
          guid: rootState.user.guid,
          cards,
        }
      );

      commit('SYNC_COLLECTION_FROM_DB', data.cards);

      commit('SYNC_COMPLETE');
      commit('UPDATE_SYNCHED', true);
      commit('UPDATE_TIMESTAMP');
    } catch (err) {
      commit('SYNC_COMPLETE');
      commit('UPDATE_SYNCHED');
      console.error('Problem synchronizing card data!', err);
    }
  },
};

export const mutations = {
  CLEAR_COLLECTION(state) {
    Vue.set(state, 'cards', {});
    Vue.set(state, 'updated', '');
    Vue.set(state, 'synched', '');
    Vue.set(state, 'synchronizing', false);
    Vue.set(state, 'autoSync', false);
  },

  COMMENT_SUBMIT(state, { cID, text }) {
    Vue.set(state.cards[cID], 'comments', text);
  },

  FILTER_OWN(state) {
    Vue.set(state.filters, 'own', true);
    Vue.set(state.filters, 'wish', false);
  },

  FILTER_CMC_ADD(state, cmc) {
    Vue.set(state.filters, 'cmc', cmc);
  },

  FILTER_CMC_REMOVE(state) {
    Vue.set(state.filters, 'cmc', null);
  },

  FILTER_COLOR_ADD(state, color) {
    Vue.set(state.filters, 'colors', [...state.filters.colors, color]);
  },

  FILTER_COLOR_REMOVE(state, color) {
    const i = state.filters.colors.indexOf(color);
    state.filters.colors.splice(i, 1);
  },

  FILTER_RARITY_ADD(state, rarity) {
    Vue.set(state.filters, 'rarity', [...state.filters.rarity, rarity]);
  },

  FILTER_RARITY_REMOVE(state, rarity) {
    const i = state.filters.rarity.indexOf(rarity);
    state.filters.rarity.splice(i, 1);
  },

  FILTER_RESET_ALL(state) {
    Vue.set(state.filters, 'own', true);
    Vue.set(state.filters, 'wish', false);
    Vue.set(state.filters, 'sets', '');
    Vue.set(state.filters, 'colors', []);
    Vue.set(state.filters, 'rarity', []);
    Vue.set(state.filters, 'cmc', null);
    Vue.set(state.filters, 'tags', []);
  },

  FILTER_SET_ADD(state, set) {
    Vue.set(state.filters, 'sets', set);
  },

  FILTER_SET_REMOVE(state) {
    Vue.set(state.filters, 'sets', '');
  },

  FILTER_TAG_ADD(state, tag) {
    Vue.set(state.filters, 'tags', [...state.filters.tags, tag]);
  },

  FILTER_TAG_REMOVE(state, tag) {
    const i = state.filters.tags.indexOf(tag);
    state.filters.tags.splice(i, 1);
  },

  FILTER_WISH(state) {
    Vue.set(state.filters, 'wish', !state.filters.wish);
    if (state.filters.wish) {
      Vue.set(state.filters, 'own', false);
    } else {
      Vue.set(state.filters, 'own', true);
    }
  },

  OWN_SWITCH(state, cID) {
    Vue.set(state.cards[cID], 'own', !state.cards[cID].own);
  },

  QUANTITY_DECREMENT(state, { cID, con }) {
    if (state.cards[cID].condition[con] > 0) {
      Vue.set(
        state.cards[cID].condition,
        con,
        state.cards[cID].condition[con] - 1
      );
      return;
    }
    Vue.set(state.cards[cID].condition, con, 0);
  },

  QUANTITY_INCREMENT(state, { cID, con }) {
    if (state.cards[cID].condition[con] >= 0) {
      Vue.set(
        state.cards[cID].condition,
        con,
        state.cards[cID].condition[con] + 1
      );
      return;
    }
    Vue.set(state.cards[cID].condition, con, 1);
  },

  SYNC_COLLECTION_FROM_DB(state, cards) {
    Vue.set(state, 'cards', cards);
  },

  SYNC_COMPLETE(state) {
    Vue.set(state, 'synchronizing', false);
  },

  SYNC_IN_PROGRESS(state) {
    Vue.set(state, 'synchronizing', true);
  },

  TAG_DELETE(state, { cID, tag }) {
    const i = state.cards[cID].tags.indexOf(tag);
    state.cards[cID].tags.splice(i, 1);
  },

  TAG_SUBMIT(state, { cID, tag }) {
    Vue.set(state.cards[cID], 'tags', [...state.cards[cID].tags, tag]);
  },

  UPDATE_AUTO_SYNC(state, bool) {
    Vue.set(state, 'autoSync', bool);
  },

  UPDATE_COLLECTION(state, { cID, cardData }) {
    Vue.set(state.cards, cID, cardData);
  },

  UPDATE_SYNCHED(state, success) {
    if (!success) {
      Vue.set(state, 'synched', '');
    } else {
      Vue.set(state, 'synched', new Date());
    }
  },

  UPDATE_TIMESTAMP(state, cID) {
    const date = new Date();
    if (cID) {
      Vue.set(state.cards[cID], 'updatedAt', date);
    }
    state.updated = date;
  },

  WISH_SWITCH(state, cID) {
    Vue.set(state.cards[cID], 'wish', !state.cards[cID].wish);
  },
};
