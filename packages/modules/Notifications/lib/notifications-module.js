import { proxydi } from '@deip/proxydi';
import { notificationsStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance')

  if (store) {
    store.registerModule('notifications', notificationsStore);
  } else {
    throw Error('[NotificationsModule]: storeInstance is not provided');
  }
};

export const NotificationsModule = {
  name: 'NotificationsModule',
  deps: [
    'EnvModule',
    'UsersModule'
  ],
  install
};
