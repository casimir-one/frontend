import { assert, setLocalesMessages } from '@deip/toolbox';
import { reviewsRegistry, reviewRequestsRegistry } from './store';

const moduleName = 'ReviewsModule';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    store,
    i18n

  } = options;

  assert(!!store, `[${moduleName}]: store instance is not provided`);
  assert(!!i18n, `[${moduleName}]: i18n instance is not provided`);

  setLocalesMessages(i18n, locales);

  assert(!!store, `[${moduleName}]: store instance is not provided`);

  store.registerModule('reviews', reviewsRegistry);
  store.registerModule('reviewRequests', reviewRequestsRegistry);
};

export const ReviewsModule = {
  name: moduleName,
  deps: [
    'UsersModule',
    'ProjectsModule',
    'ProjectContentModule'
  ],
  install
};
