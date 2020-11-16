export const state = () => ({
  card: {
    id: '',
    oracle_id: '',
    multiverse_ids: [],
    name: '',
    lang: '',
    released_at: '',
    scryfall_uri: '',
    layout: '',
    highres_image: false,
    image_uris: {
      normal: '',
      large: '',
      png: '',
    },
    mana_cost: '',
    cmc: 0,
    type_line: '',
    oracle_text: '',
    power: '',
    toughness: '',
    colors: [],
    color_identity: [],
    keywords: [],
    legalities: {
      standard: '',
      historic: '',
      pioneer: '',
      modern: '',
      legacy: '',
      pauper: '',
      vintage: '',
      penny: '',
      commander: '',
      brawl: '',
      duel: '',
      oldschool: '',
    },
    reserved: false,
    foil: false,
    nonfoil: false,
    oversized: false,
    promo: false,
    reprint: false,
    variation: false,
    set: '',
    set_name: '',
    set_type: '',
    collector_number: '',
    rarity: '',
    card_back_id: '',
    artist: '',
    artist_ids: [],
    illustration_id: '',
    border_color: '',
    frame: '',
    full_art: false,
    textless: false,
    booster: false,
    story_spotlight: false,
    prices: {
      usd: '',
      usd_foil: '',
      eur: '',
      eur_foil: '',
      tix: '',
    },
    related_uris: {
      gatherer: '',
      edhrec: '',
    },
  },
});

export const getters = {
  cardImage: (state) => state.card.image_uris.png,
  cardName: (state) => state.card.name,
  printingLanguage: (state) => {
    if (state.card.lang === 'en') {
      return 'English';
    }
    return state.card.lang;
  },
  printingRarity: (state) => {
    if (!state.card.rarity) {
      return '';
    }
    const rArr = state.card.rarity.split(' ');
    for (let i = 0; i < rArr.length; i++) {
      rArr[i] = rArr[i][0].toUpperCase() + rArr[i].substr(1);
    }

    return rArr.join(' ');
  },
  printingNumber: (state) => {
    if (!state.card.collector_number) {
      return '';
    }
    return state.card.collector_number.toLowerCase();
  },
  setNameAbbreviation: (state) => {
    if (!state.card.set) {
      return '';
    }
    return state.card.set.toUpperCase();
  },
  setName: (state) => state.card.set_name,
};

export const actions = {
  async queryCard({ commit }, query) {
    try {
      const data = await this.$axios.$post(
        'http://localhost:3420/api/query/card',
        {
          query,
        }
      );

      commit('SET_CARD', data.card);
    } catch (err) {
      console.error('Problem getting card data!', err);
    }
  },
};

export const mutations = {
  SET_CARD: (state, card) => (state.card = card),
};
