import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';
import { projectContentStore, projectContentDraftStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = () => {
  if (install.installed) return;
  install.installed = true;

  const i18n = proxydi.get('i18nInstance');

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[ProjectContentModule]: i18nInstance is not provided');
  }

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('projectContent', projectContentStore);
    store.registerModule('projectContentDraft', projectContentDraftStore);
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
    'ProjectsModule'
  ],
  install
};
