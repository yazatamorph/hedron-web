import Vue from 'vue';
import sortBy from 'lodash/sortBy';

export const state = () => ({
  cards: {},
  filters: {
    name: '',
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
    // this is so inefficient lol
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
};

export const actions = {
  // NOTE: logic actions
  addToCollection({ dispatch }, { cardData, op }) {
    const update = { ...cardData };
    // op is either 'own' or 'wish'
    update[op] = true;

    dispatch('dbUpdate', update);
  },

  changeComments({ dispatch, state }, { cID, text }) {
    const update = getNoReact(state.cards[cID]);
    update.comments = text;
    dispatch('dbUpdate', update);
  },

  changeOwn({ dispatch, state }, { cID, cardData }) {
    if (!state.cards[cID]) {
      dispatch('addToCollection', { cID, cardData, op: 'own' });
    } else {
      const update = getNoReact(state.cards[cID]);
      update.own = !update.own;
      dispatch('dbUpdate', update);
    }
  },

  changeQuantity({ dispatch, state }, { cID, con, op }) {
    const update = getNoReact(state.cards[cID]);
    if (op === 'add') {
      update.condition[con] =
        update.condition[con] >= 0 ? update.condition[con] + 1 : 1;
    } else if (op === 'subtract') {
      update.condition[con] > 0
        ? (update.condition[con] -= 1)
        : (update.condition[con] = 0);
    }
    dispatch('dbUpdate', update);
  },

  changeTags({ dispatch, state }, { cID, tag, op }) {
    const update = getNoReact(state.cards[cID]);
    if (op === 'submit') update.tags.push(tag);
    if (op === 'delete') {
      const i = update.tags.indexOf(tag);
      update.tags.splice(i, 1);
    }
    dispatch('dbUpdate', update);
  },

  changeWish({ dispatch, state }, { cID, cardData }) {
    if (!state.cards[cID]) {
      dispatch('addToCollection', { cID, cardData, op: 'wish' });
    } else {
      const update = getNoReact(state.cards[cID]);
      update.wish = !update.wish;
      dispatch('dbUpdate', update);
    }
  },

  clearCollection({ commit }) {
    commit('CLEAR_COLLECTION');
    commit('FILTER_RESET_ALL');
  },
  // NOTE: DB actions
  // pulls data from DB and listens for ongoing changes
  dbSubscribe({ commit }) {
    if (this.$user.is) {
      this.$user
        .get('cards')
        .map()
        // callback is executed on every update event
        // NOTE: there may be more than one event per item
        .on((data, key) => {
          const card = JSON.parse(data);
          if (!card) {
            commit('DB_REMOVED_CARD', key);
          } else {
            const update = {
              key,
              setNumAbbr: card.setNumAbbr,
              collector_number: card.collector_number,
              name: card.name,
              set: card.set,
              set_name: card.set_name,
              color_identity: card.color_identity,
              rarity: card.rarity,
              cmc: card.cmc,
              own: card.own,
              wish: card.wish,
              condition: card.condition,
              tags: card.tags,
              comments: card.comments,
            };

            if (card?.image_uris?.normal) {
              update.image_uris = card.image_uris;
            }
            if (card?.card_faces?.[0]?.image_uris) {
              update.card_faces = card.card_faces;
            }
            commit('STORE_UPDATE_CARD', update);
          }
        });
    }
  },
  // inserts or updates card in store & DB
  // all client-initiated card updates should go through here
  dbUpdate({ commit }, update) {
    if (this.$user.is) {
      if (update.key) {
        this.$user.get('cards').get(update.key).put(JSON.stringify(update));
      } else {
        this.$user.get('cards').set(JSON.stringify(update));
      }
      commit('STORE_UPDATE_CARD', update);
    }
  },
  // NOTE: filter actions
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

  filterName({ commit }, text) {
    commit('FILTER_NAME', text);
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
};

export const mutations = {
  // handles removing a card that was deleted from the DB
  DB_REMOVED_CARD(state, key) {
    const card = Object.values(state.cards).find((c) => c.key === key);
    Vue.set(state.cards, card.setNumAbbr, null);
  },
  // all non-deletion updates to cards should go through this mutation
  STORE_UPDATE_CARD(state, update) {
    Vue.set(state.cards, update.setNumAbbr, update);
  },

  CLEAR_COLLECTION(state) {
    Vue.set(state, 'cards', {});
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

  FILTER_NAME(state, text) {
    Vue.set(state.filters, 'name', text);
  },

  FILTER_RARITY_ADD(state, rarity) {
    Vue.set(state.filters, 'rarity', [...state.filters.rarity, rarity]);
  },

  FILTER_RARITY_REMOVE(state, rarity) {
    const i = state.filters.rarity.indexOf(rarity);
    state.filters.rarity.splice(i, 1);
  },

  FILTER_RESET_ALL(state) {
    Vue.set(state.filters, 'name', '');
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
};

// Stupid hack to make vuex stop yelling about direct mutations that aren't really happening
// because of reactive getters/setters in the 'condition' object and 'tags' array
const getNoReact = (input) => {
  /* eslint-disable camelcase */
  const {
    key,
    setNumAbbr,
    collector_number,
    name,
    set,
    set_name,
    color_identity,
    rarity,
    cmc,
    own,
    wish,
    comments,
    condition,
    tags,
  } = input;
  const output = {
    key,
    setNumAbbr,
    collector_number,
    name,
    set,
    set_name,
    color_identity,
    rarity,
    cmc,
    own,
    wish,
    comments,
    condition: {
      nm: condition.nm,
      lp: condition.lp,
      mp: condition.mp,
      hp: condition.hp,
      dmg: condition.dmg,
      nmf: condition.nmf,
      lpf: condition.lpf,
      mpf: condition.mpf,
      hpf: condition.hpf,
      dmgf: condition.dmgf,
    },
    tags: [...tags],
  };

  if (input?.image_uris?.normal) {
    output.image_uris = input.image_uris;
  }
  if (input?.card_faces?.[0]?.image_uris) {
    output.card_faces = input.card_faces;
  }
  return output;
};
/* eslint-enable camelcase */
