import Vue from 'vue';

export const state = () => ({
  loggedIn: false,
  user: {
    email: '',
  },
});

export const getters = {};

export const actions = {
  logInUser({ commit, dispatch }, { email, password }) {
    if (!email || !password) {
      throw new Error('LOGIN_CREDENTIALS_INCOMPLETE');
    }

    this.$user.auth(email, password, (ack) => {
      if (ack.err) {
        commit('LOG_IN_FAILED');
        commit('CLEAR_USER');
        console.error('Problem logging in!', ack.err);
      } else {
        commit('LOG_IN_SUCCESS');
        commit('SET_EMAIL', email);
        // request data sync
        // dispatch('collection/syncWithDb');
      }
    });
  },

  logOutUser({ commit, dispatch, state }) {
    this.$user.leave();
    if (!this.$user.is) {
      commit('LOG_OUT');
      commit('CLEAR_USER');
      dispatch('collection/clearCollection');
    } else {
      console.error('Unknown problem logging out?!');
      commit('LOG_OUT');
      commit('CLEAR_USER');
      dispatch('collection/clearCollection');
    }
  },

  registerUser({ commit, dispatch }, { email, password }) {
    if (!email || !password) {
      throw new Error('REGISTER_CREDENTIALS_INCOMPLETE');
    }

    this.$user.create(email, password, (ack) => {
      if (ack.err) {
        commit('LOG_IN_FAILED');
        commit('CLEAR_USER');
        console.error('Problem registering user!', ack.err);
      } else {
        dispatch('logInUser', { email, password });
      }
    });
  },
};

export const mutations = {
  CLEAR_USER(state) {
    const clearUser = {
      email: '',
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
};
