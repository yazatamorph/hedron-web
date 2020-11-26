import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';

export default ({ store }) => {
  new VuexPersistence({
    storage: localforage,
    asyncStorage: true,
    key: 'hedron',
    modules: ['collection'],
  }).plugin(store);
};
