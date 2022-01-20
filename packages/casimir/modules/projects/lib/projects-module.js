import { setLocalesMessages } from '@deip/toolbox';

import { projectsStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[ProjectsModule]: i18nInstance is not provided');
  }
  if (store) {
    store.registerModule('projects', projectsStore);
  } else {
    throw Error('[ProjectsModule]: storeInstance is not provided');
  }
};

export const ProjectsModule = {
  name: 'ProjectsModule',
  deps: [
    'EnvModule',
    'UsersModule'
  ],
  install
};
