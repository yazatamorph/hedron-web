import Vue from 'vue';

export const state = () => ({
  loggedIn: false,
  user: {
    email: '',
    guid: '',
  },
});

export const getters = {};

export const actions = {
  async logInUser({ commit, dispatch }, credentials) {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('LOGIN_CREDENTIALS_INCOMPLETE');
      }

      const data = await this.$axios.$post('/api/account/login', credentials);

      if (!data.user || !data.user.guid || !data.user.email) {
        throw new Error('LOGIN_CREDENTIALS_INVALID');
      }
      // COMMIT USER DATA
      commit('LOG_IN_SUCCESS');
      commit('SET_GUID', data.user.guid);
      commit('SET_EMAIL', data.user.email);
      // DISPATCH COLLECTION SYNC ACTION
      dispatch('collection/syncWithDb');
    } catch (err) {
      commit('LOG_IN_FAILED');
      commit('CLEAR_USER');
      console.error('Problem logging in!', err);
    }
  },

  async logOutUser({ commit, dispatch, state }) {
    try {
      await this.$axios.$get('/api/account/logout');
      commit('LOG_OUT');
      commit('CLEAR_USER');
      dispatch('collection/clearCollection');
    } catch (err) {
      console.error('Problem logging out!', err);
      commit('LOG_OUT');
      commit('CLEAR_USER');
    }
  },

  async registerUser({ commit, dispatch }, credentials) {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('REGISTER_CREDENTIALS_INCOMPLETE');
      }

      const data = await this.$axios.$post(
        '/api/account/register',
        credentials
      );

      if (!data.user || !data.user.guid || !data.user.email) {
        throw new Error('REGISTER_CREDENTIALS_INVALID');
      }
      // COMMIT USER DATA
      commit('LOG_IN_SUCCESS');
      commit('SET_GUID', data.user.guid);
      commit('SET_EMAIL', data.user.email);
      // DISPATCH COLLECTION SYNC ACTION
      // This creates the new user's collection document
      dispatch('collection/syncWithDb');
    } catch (err) {
      commit('LOG_IN_FAILED');
      commit('CLEAR_USER');
      console.error('Problem registering user!', err);
    }
  },

  refreshedAccessToken({ commit }, token) {
    commit('SET_ACCESS_TOKEN', token);
  },
};

export const mutations = {
  CLEAR_USER(state) {
    const clearUser = {
      email: '',
      guid: '',
    };
    Vue.set(state, 'user', clearUser);
  },

  LOG_IN_FAILED(state) {
    Vue.set(state, 'loggedIn', false);
  },

  LOG_IN_SUCCESS(state) {
    Vue.set(state, 'loggedIn', true);
  },

  LOG_OUT(state) {
    Vue.set(state, 'loggedIn', false);
  },

  SET_EMAIL(state, email) {
    Vue.set(state.user, 'email', email);
  },

  SET_GUID(state, guid) {
    Vue.set(state.user, 'guid', guid);
  },
};
