import { proxydi } from '@deip/proxydi';
import { bookmarksStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance')

  if (store) {
    store.registerModule('bookmarks', bookmarksStore);
  } else {
    throw Error('[BookmarksModule]: storeInstance is not provided');
  }
};

export const BookmarksModule = {
  name: 'BookmarksModule',
  deps: [
    'EnvModule',
    'UsersModule'
  ],
  install
};
