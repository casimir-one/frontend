import { setLocalesMessages } from '@deip/toolbox';
import { contractAgreementsStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[ContractAgreementsModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('contractAgreements', contractAgreementsStore);
  } else {
    throw Error('[ContractAgreementsModule]: storeInstance is not provided');
  }
};

export const ContractAgreementsModule = {
  name: 'ContractAgreementsModule',
  deps: [
    'EnvModule',
    'UsersModule',
    'TeamsModule'
  ],
  install
};
