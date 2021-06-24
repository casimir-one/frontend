import {
  ValidationObserver,
  ValidationProvider,
  extend
} from 'vee-validate';

import {
  required,
  integer,
  regex,
  email
} from 'vee-validate/dist/rules';

import { setLocalesMessages } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import {
  number,
  minMax,
  minMaxValue,
  unique,
  username,
  dateBefore,
  dateAfter
} from './rules';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const i18n = proxydi.get('i18nInstance');

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[ValidationPlugin]: i18nInstance is not provided');
  }

  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  extend('email', email);
  extend('required', {
    ...required,
    message: (_, values) => i18n.t('plugin.validation.required', values)
  });

  extend('integer', {
    ...integer,
    message: (_, values) => i18n.t('plugin.validation.integer', values)
  });
  extend('regex', regex);

  extend('minMax', minMax);
  extend('minMaxValue', minMaxValue);
  extend('unique', unique);
  extend('number', number);
  extend('username', username);
  extend('dateBefore', dateBefore);
  extend('dateAfter', dateAfter);
};

export const ValidationPlugin = {
  name: 'ValidationPlugin',
  deps: [
    'EnvModule'
  ],
  install
};
