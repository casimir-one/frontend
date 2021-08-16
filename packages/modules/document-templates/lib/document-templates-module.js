import { proxydi } from '@deip/proxydi';
import { documentTemplatesStore } from './store';

const install = () => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

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
