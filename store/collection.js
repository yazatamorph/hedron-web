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
});

export const getters = {
  getAllCards: (state) => state.cards,
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
    state.cards[cID].tags.splice(tag, 1);
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
