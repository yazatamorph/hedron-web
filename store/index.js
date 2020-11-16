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
  auth: (state) => state.user.auth,
  email: (state) => state.user.email,
  guid: (state) => state.user.guid,
  preferences: (state) => state.user.preferences,
  screenName: (state) => state.user.screenName,
};

export const actions = {};

export const mutations = {};
