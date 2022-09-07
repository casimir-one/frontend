import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from 'vee-validate';

import {
  required,
  integer,
  regex,
  excluded,
  size

} from 'vee-validate/dist/rules';
import en from 'vee-validate/dist/locale/en.json';
import { setLocalesMessages } from '@casimir.one/toolbox';
import {
  email,
  number,
  minMax,
  minMaxValue,
  minValue,
  maxValue,
  unique,
  equal,
  dateBefore,
  dateAfter,
  dateAfterNow
} from './rules';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[ValidationPlugin]: i18nInstance is not provided');
  }

  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  localize({ en });
  localize(i18n.locale);

  extend('email', email);
  extend('required', required);

  extend('integer', integer);
  extend('regex', regex);
  extend('excluded', excluded);

  extend('minMax', minMax);
  extend('minMaxValue', minMaxValue);
  extend('minValue', minValue);
  extend('maxValue', maxValue);
  extend('unique', unique);
  extend('equal', equal);
  extend('number', number);
  extend('dateBefore', dateBefore);
  extend('dateAfter', dateAfter);
  extend('dateAfterNow', dateAfterNow);
  extend('size', size);
};

export const ValidationPlugin = {
  name: 'ValidationPlugin',
  deps: [
    'EnvModule'
  ],
  install
};
