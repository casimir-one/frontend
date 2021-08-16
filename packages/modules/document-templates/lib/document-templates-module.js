import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';
import { documentTemplatesStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = () => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');
  const i18n = proxydi.get('i18nInstance');

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[DocumentTemplatesModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('documentTemplates', documentTemplatesStore);
  } else {
    throw Error('[DocumentTemplatesModule]: storeInstance is not provided');
  }
};

export const DocumentTemplatesModule = {
  name: 'DocumentTemplatesModule',
  deps: [
    'EnvModule'
  ],
  install
};
