import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';
import { bookmarksStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');
  const i18n = proxydi.get('i18nInstance');

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[BookmarksModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('bookmarks', bookmarksStore);

    store.dispatch('bookmarks/get');

    store.watch((_, getters) => getters['auth/username'], (username) => {
      if (username) {
        store.dispatch('bookmarks/get');
      } else {
        store.dispatch('bookmarks/clear');
      }
    });
  } else {
    throw Error('[BookmarksModule]: storeInstance is not provided');
  }
};

export const BookmarksModule = {
  name: 'BookmarksModule',
  deps: [
    'EnvModule',
    'AuthModule',
    'UsersModule'
  ],
  install
};
