export const state = () => ({
  guid: '',
  cards: [],
});

export const getters = {
  allCards: (state) => state.cards,
};

export const actions = {
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
  SYNC_COLLECTION(state, data = []) {
    state.cards = data;
  },
};
