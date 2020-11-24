export const state = () => ({
  guid: '',
  cardIndex: -1,
  cards: [],
});

export const getters = {
  allCards: (state) => state.cards,
};

export const actions = {
  changeComments({ commit }, text) {
    commit('COMMENT_SUBMIT', text);
  },

  changeQuantity({ commit }, { con, op }) {
    if (op === 'add') {
      commit('QUANTITY_INCREMENT', con);
    } else if (op === 'subtract') {
      commit('QUANTITY_DECREMENT', con);
    }
  },

  changeTags({ commit }, { tag, op }) {
    if (op === 'submit') {
      commit('TAG_SUBMIT', tag);
    }
    if (op === 'delete') {
      commit('TAG_DELETE', tag);
    }
  },

  enterInCollection({ commit, state }, update) {
    const i = state.cardIndex;

    if (i === -1) {
      commit('ADD_TO_COLLECTION', update);
    } else {
      commit('UPDATE_COLLECTION', { update, i });
    }
  },

  indexInCollection({ state, commit }, { set, num }) {
    const setAbbr = set.toUpperCase();
    const cardNum = num.toLowerCase();

    const card = state.cards.find(
      ({ set, num }) => set === setAbbr && num === cardNum
    );

    let index;
    if (!card) {
      index = state.cards.length;

      commit('ADD_TO_COLLECTION', {
        set: setAbbr,
        num: cardNum,
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
      });

      commit('SET_COLLECTION_INDEX', index);
      return;
    }

    index = state.cards.indexOf(card);
    commit('SET_COLLECTION_INDEX', index);
  },

  async syncCollection({ commit, state, rootState, dispatch }) {
    try {
      if (!rootState.auth) {
        return dispatch('LOGGED_OUT', null, { root: true });
      }
      const data = await this.$axios.$get(
        'https://mytotallyrealurl.com/api/collection/',
        {
          headers: {
            Authorization: `Bearer ${rootState.getters.auth}`,
            Accept: 'application/json',
          },
        }
      );

      // need to compare items in state.cards (i.e. local data)
      // with items in data.cards - add/remove/replace as appropriate
      const synchronizedData = data.cards;

      commit('SYNC_COLLECTION', synchronizedData);
    } catch (err) {
      console.error('Error:', err);
    }
  },
};

export const mutations = {
  ADD_TO_COLLECTION(state, update) {
    state.cards.push({ ...update, updated: new Date() });
  },
  COMMENT_SUBMIT(state, text) {
    state.cards[state.cardIndex].comments = text;
  },
  QUANTITY_DECREMENT(state, con) {
    if (state.cards[state.cardIndex].condition[con] > 0) {
      state.cards[state.cardIndex].condition[con]--;
      return;
    }
    state.cards[state.cardIndex].condition[con] = 0;
  },
  QUANTITY_INCREMENT(state, con) {
    if (state.cards[state.cardIndex].condition[con] >= 0) {
      state.cards[state.cardIndex].condition[con]++;
      return;
    }
    state.cards[state.cardIndex].condition[con] = 1;
  },
  SET_COLLECTION_INDEX(state, index) {
    state.cardIndex = index;
  },
  SYNC_COLLECTION(state, data = []) {
    state.cards = data;
  },
  TAG_DELETE(state, index) {
    state.cards[state.cardIndex].tags.splice(index, 1);
  },
  TAG_SUBMIT(state, tag) {
    state.cards[state.cardIndex].tags.push(tag);
  },
  UPDATE_COLLECTION(state, { update, i }) {
    state.cards.splice(i, 1, { ...update, updated: new Date() });
  },
};
