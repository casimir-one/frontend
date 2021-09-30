import { proxydi } from '@deip/proxydi';
import { contractAgreementsStore } from './store';

const install = () => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('contractAgreements', contractAgreementsStore);
  } else {
    throw Error('[ContractAgreementsModule]: storeInstance is not provided');
  }
};

export const ContractAgreementsModule = {
  name: 'ContractAgreementsModule',
  deps: [
    'EnvModule'
  ],
  install
};
