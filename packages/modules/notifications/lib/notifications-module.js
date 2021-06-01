import { proxydi } from '@deip/proxydi';
import { notificationsStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('notifications', notificationsStore);

    store.dispatch('notifications/get');

    store.watch((_, getters) => getters['auth/username'], (username) => {
      if (username) {
        store.dispatch('notifications/get');
      } else {
        store.dispatch('notifications/clear');
      }
    });
  } else {
    throw Error('[NotificationsModule]: storeInstance is not provided');
  }
};

export const NotificationsModule = {
  name: 'NotificationsModule',
  deps: [
    'EnvModule',
    'UsersModule',
    'AuthModule'
  ],
  install
};
