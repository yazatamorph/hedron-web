export const state = () => ({
  user: {
    auth: false,
    email: '',
    guid: '',
    preferences: {},
    screenName: '',
  },
});

export const getters = {
  user: (state) => state.user,
  auth: (state) => state.auth,
  email: (state) => state.email,
  guid: (state) => state.guid,
  preferences: (state) => state.preferences,
  screenName: (state) => state.screenName,
};

export const actions = {};

export const mutations = {};
