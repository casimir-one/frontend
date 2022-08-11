import { assert, setLocalesMessages } from '@casimir/toolbox';
import { callForCurrentUser } from '@casimir/platform-util';
import { teamsStore } from './store';
import { teamScope } from './config';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);
const moduleName = 'TeamsModule';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    store,
    i18n,
    attributesMappedKeys = [],
    layoutsMappedKeys = []
  } = options;

  assert(!!store, `[${moduleName}]: store instance is not provided`);
  assert(!!i18n, `[${moduleName}]: i18n instance is not provided`);

  setLocalesMessages(i18n, locales);

  store.registerModule('teams', teamsStore);

  store.dispatch('scopesRegistry/addScope', teamScope);

  if (attributesMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: 'team',
      target: 'attributes',
      keys: attributesMappedKeys
    });
  }

  if (layoutsMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: 'team',
      target: 'layouts',
      keys: layoutsMappedKeys
    });
  }

  callForCurrentUser(
    store,
    'teams/getCurrentUserTeams'
  );
};

export const TeamsModule = {
  name: 'TeamsModule',
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',

    'EnvModule',
    'ScopesModule',
    'AttributesModule',
    'LayoutsModule',

    'AuthModule',
    'UsersModule'
  ],
  install
};
