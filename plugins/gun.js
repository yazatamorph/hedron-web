import Gun from 'gun';
import 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import rindexed from 'gun/lib/rindexed';

export default ({ store }, inject) => {
  const gun = Gun('https://hedronarchive.com/gun', {
    store: rindexed,
    localStorage: false,
  });

  console.log('STORE', store);
  const { dispatch } = store;

  gun.on('auth', () => {
    dispatch('continueSession');
  });

  inject('gun', gun);
  inject('user', gun.user().recall({ sessionStorage: true }));
};
