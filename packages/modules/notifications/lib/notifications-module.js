import { proxydi } from '@deip/proxydi';
import { callForCurrentUser } from '@deip/platform-store';
import { notificationsStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('notifications', notificationsStore);

    callForCurrentUser(
      store,
      'notifications/get',
      'notifications/clear'
    );
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
