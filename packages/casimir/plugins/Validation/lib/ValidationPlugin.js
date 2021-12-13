import {
  ValidationObserver,
  ValidationProvider,
  extend
} from 'vee-validate';

import {
  required,
  integer,
  regex

} from 'vee-validate/dist/rules';

import { setLocalesMessages } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import {
  email,
  number,
  minMax,
  minMaxValue,
  minValue,
  maxValue,
  unique,
  equal,
  username,
  dateBefore,
  dateAfter,
  dateAfterNow
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
  extend('minValue', minValue);
  extend('maxValue', maxValue);
  extend('unique', unique);
  extend('equal', equal);
  extend('number', number);
  extend('username', username);
  extend('dateBefore', dateBefore);
  extend('dateAfter', dateAfter);
  extend('dateAfterNow', dateAfterNow);
};

export const ValidationPlugin = {
  name: 'ValidationPlugin',
  deps: [
    'EnvModule'
  ],
  install
};
