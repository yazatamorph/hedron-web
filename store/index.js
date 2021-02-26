import Vue from 'vue';

export const state = () => ({
  loggedIn: false,
  user: {
    accessToken: '',
    refreshToken: '',
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

      const data = await this.$axios.$post('/api/account/login', credentials, {
        skipAuthRefresh: true,
      });

      if (
        !data.guid ||
        !data.email ||
        !data.accessToken ||
        !data.refreshToken
      ) {
        throw new Error('LOGIN_CREDENTIALS_INVALID');
      }
      // COMMIT USER DATA
      commit('LOG_IN_SUCCESS');
      commit('SET_GUID', data.guid);
      commit('SET_EMAIL', data.email);
      commit('SET_ACCESS_TOKEN', data.accessToken);
      commit('SET_REFRESH_TOKEN', data.refreshToken);
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
      await this.$axios.$post(
        '/api/account/logout',
        {
          refreshToken: state.user.refreshToken,
        },
        { skipAuthRefresh: true }
      );
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
        credentials,
        {
          skipAuthRefresh: true,
        }
      );

      if (
        !data.guid ||
        !data.email ||
        !data.accessToken ||
        !data.refreshToken
      ) {
        throw new Error('REGISTER_CREDENTIALS_INVALID');
      }
      // COMMIT USER DATA
      commit('LOG_IN_SUCCESS');
      commit('SET_GUID', data.guid);
      commit('SET_EMAIL', data.email);
      commit('SET_ACCESS_TOKEN', data.accessToken);
      commit('SET_REFRESH_TOKEN', data.refreshToken);
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
      accessToken: '',
      refreshToken: '',
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

  SET_ACCESS_TOKEN(state, accessToken) {
    Vue.set(state.user, 'accessToken', accessToken);
  },

  SET_EMAIL(state, email) {
    Vue.set(state.user, 'email', email);
  },

  SET_GUID(state, guid) {
    Vue.set(state.user, 'guid', guid);
  },

  SET_REFRESH_TOKEN(state, refreshToken) {
    Vue.set(state.user, 'refreshToken', refreshToken);
  },
};
