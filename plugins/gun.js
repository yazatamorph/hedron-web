import Gun from 'gun';
import 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import store from 'gun/lib/rindexed';

export default ({ app }, inject) => {
  const gun = Gun('https://hedronarchive.com/gun', {
    store,
    localStorage: false,
  });

  inject('gun', gun);
  inject('user', gun.user().recall({ sessionStorage: true }));
};
