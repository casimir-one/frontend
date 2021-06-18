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

import { setLocalesMessages, validateAccountName, wrapInArray } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

export const username = {
  validate(value) {
    const { valid, error } = validateAccountName(value, '{_field_}');
    return valid || error;
  },
  computesRequired: true

};

export const minMax = {
  params: ['min', 'max'],

  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },

  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.minMax', values);
  }
};

export const minMaxValue = {
  params: ['min', 'max'],

  validate(value, { min, max }) {
    const v = parseFloat(value);
    return v >= min && v <= max;
  },

  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.minMaxValue', values);
  }
};

export const unique = {
  params: ['list', 'caseSensitive'],
  validate(value, { list, caseSensitive }) {
    const l = caseSensitive ? list : list.map((a) => a.toLowerCase());
    const v = caseSensitive ? value : value.toLowerCase();

    return !l.includes(v);
  },
  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.unique', values);
  }
};

const normalizeDates = (curr, prev, next) => ({
  currentDate: new Date(curr),
  prevDates: prev ? wrapInArray(prev).map((d) => new Date(d)) : [],
  nextDates: next ? wrapInArray(next).map((d) => new Date(d)) : []
});

export const dateBefore = {
  params: ['target'],
  validate(value, { target }) {
    if (!target) return true;

    const { currentDate, nextDates } = normalizeDates(value, null, target);

    return nextDates.some((d) => currentDate <= d);
  },

  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.dateBefore', values);
  }
};

export const dateAfter = {
  params: ['target'],
  validate(value, { target }) {
    if (!target) return true;

    const { currentDate, prevDates } = normalizeDates(value, target, null);

    return prevDates.some((d) => currentDate >= d);
  },

  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.dateAfter', values);
  }
};

export const dateBetween = {
  params: ['prev', 'next'],
  validate(value, { prev, next }) {
    const { currentDate, prevDates, nextDates } = normalizeDates(value, prev, next);

    if (prevDates.length && nextDates.length) {
      return prevDates.some((d) => currentDate >= d)
        && nextDates.some((d) => currentDate <= d);
    }

    if (prevDates.length && !nextDates.length) {
      return prevDates.some((d) => currentDate >= d);
    }

    if (!prevDates.length && nextDates.length) {
      nextDates.some((d) => currentDate <= new Date(d));
    }

    return true;
  },

  message(name, { prev, next }) {
    const i18n = proxydi.get('i18nInstance');
    const prevDates = wrapInArray(prev);
    const nextDates = wrapInArray(next);

    if (!nextDates.length) {
      return i18n.t('plugin.validation.dateBetween.after', { date: prevDates[0] });
    }
    if (!prevDates.length) {
      return i18n.t('plugin.validation.dateBetween.before', { date: nextDates[0] });
    }

    return i18n.t('plugin.validation.dateBetween.between',
      {
        prev: prevDates[0],
        next: nextDates[0]
      });
  }
};

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

  extend('minMax', minMax);
  extend('minMaxValue', minMaxValue);
  extend('unique', unique);
  extend('regex', regex);
  extend('email', email);

  extend('username', username);

  extend('required', {
    ...required,
    message: (_, values) => i18n.t('plugin.validation.required', values)
  });

  extend('integer', {
    ...integer,
    message: (_, values) => i18n.t('plugin.validation.integer', values)
  });

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
