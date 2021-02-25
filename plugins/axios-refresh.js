import createAuthRefreshInterceptor from 'axios-auth-refresh';

export default ({ $axios, store }) => {
  const refreshLogic = (failedRequest) =>
    $axios
      .$post('/account/refresh', {
        refreshToken: store.state.user.refreshToken,
      })
      .then((data) => {
        store.dispatch('refreshedAccessToken', data.accessToken);
        failedRequest.response.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return Promise.resolve();
      });

  createAuthRefreshInterceptor($axios, refreshLogic);
};
