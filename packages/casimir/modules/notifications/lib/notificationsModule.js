import { callForCurrentUser } from '@deip/platform-util';
import { notificationsStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store } = options;

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
