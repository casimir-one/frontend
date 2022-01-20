import { setLocalesMessages } from '@deip/toolbox';
import { callForCurrentUser } from '@deip/platform-store';
import { teamsStore, currentUserTeamsStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[TeamsModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('teams', teamsStore);
    store.registerModule('currentUserTeams', currentUserTeamsStore);

    callForCurrentUser(
      store,
      'currentUserTeams/getList',
      'currentUserTeams/clear'
    );
  } else {
    throw Error('[TeamsModule]: storeInstance is not provided');
  }
};

export const TeamsModule = {
  name: 'TeamsModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended',
    'AuthModule',
    'UsersModule'
  ],
  install
};
