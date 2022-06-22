import { setLocalesMessages } from '@deip/toolbox';
import { projectContentStore, projectContentDraftsStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[ProjectContentModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('projectContent', projectContentStore);
    store.registerModule('projectContentDrafts', projectContentDraftsStore);
  } else {
    throw Error('[ProjectContentModule]: storeInstance is not provided');
  }
};

export const ProjectContentModule = {
  name: 'ProjectContentModule',
  deps: [
    'EnvModule',
    'AuthModule',
    'UsersModule',
    'NftCollectionsModule'
  ],
  install
};
