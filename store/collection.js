import Vue from 'vue';

export const state = () => ({
  guid: '',
  cards: {},
  updated: '',
  cardInit: {
    set: '',
    collector_number: '',
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
  filters: {
    own: true,
    wish: false,
    sets: '',
    colors: [],
    cmc: null,
    tags: [],
  },
});

export const getters = {
  getAllCards: (state) => state.cards,
  getSets: (state) => {
    const sets = [];
    Object.keys(state.cards).forEach((card) => {
      if (!sets.includes(state.cards[card].set) && state.cards[card].set) {
        sets.push(state.cards[card].set);
      }
    });
    return sets;
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
    return tags;
  },
};

export const actions = {
  addToCollection({ commit }, { cID, cardData, op }) {
    cardData[op] = true;

    commit('UPDATE_COLLECTION', { cID, cardData });
    commit('UPDATE_TIMESTAMP');
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

  filterCMC({ commit, state }, { cmc }) {
    if (state.filters.cmc === cmc) {
      commit('FILTER_CMC_REMOVE');
    } else {
      commit('FILTER_CMC_ADD', cmc);
    }
  },

  filterColor({ commit, state }, { color }) {
    if (state.filters.colors.includes(color)) {
      commit('FILTER_COLOR_REMOVE', color);
    } else {
      commit('FILTER_COLOR_ADD', color);
    }
  },

  filterOwn({ commit }) {
    commit('FILTER_OWN');
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

  // async syncCollection({ commit, state, rootState, dispatch }) {
  //   try {
  //     if (!rootState.auth) {
  //       return dispatch('LOGGED_OUT', null, { root: true });
  //     }
  //     const data = await this.$axios.$get(
  //       'https://mytotallyrealurl.com/api/collection/',
  //       {
  //         headers: {
  //           Authorization: `Bearer ${rootState.getters.auth}`,
  //           Accept: 'application/json',
  //         },
  //       }
  //     );

  //     // need to compare items in state.cards (i.e. local data)
  //     // with items in data.cards - add/remove/replace as appropriate
  //     const synchronizedData = data.cards;

  //     commit('SYNC_COLLECTION', synchronizedData);
  //   } catch (err) {
  //     console.error('Error:', err);
  //   }
  // },
};

export const mutations = {
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

  FILTER_RESET_ALL(state) {
    Vue.set(state.filters, 'own', true);
    Vue.set(state.filters, 'wish', false);
    Vue.set(state.filters, 'sets', '');
    Vue.set(state.filters, 'colors', []);
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

  TAG_DELETE(state, { cID, tag }) {
    const i = state.cards[cID].tags.indexOf(tag);
    state.cards[cID].tags.splice(i, 1);
  },

  TAG_SUBMIT(state, { cID, tag }) {
    Vue.set(state.cards[cID], 'tags', [...state.cards[cID].tags, tag]);
  },

  UPDATE_COLLECTION(state, { cID, cardData }) {
    Vue.set(state.cards, cID, cardData);
  },

  UPDATE_TIMESTAMP(state, cID) {
    state.updated = new Date();
    if (cID) {
      Vue.set(state.cards[cID], 'updated', new Date());
    }
  },

  WISH_SWITCH(state, cID) {
    Vue.set(state.cards[cID], 'wish', !state.cards[cID].wish);
  },
};
