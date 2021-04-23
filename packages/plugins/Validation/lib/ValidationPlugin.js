import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import { wrapInArray } from '@deip/toolbox';

import en from 'vee-validate/dist/locale/en.json';
import {
  required,
  integer
} from 'vee-validate/dist/rules';

export const minMax = {
  params: ['min', 'max'],

  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },

  message: '{_field_} length should be from {min} to {max} characters in length'
};

export const minMaxValue = {
  params: ['min', 'max'],

  validate(value, { min, max }) {
    const v = parseFloat(value);
    return v >= min && v <= max;
  },

  message: '{_field_} should be from {min} to {max}'
};

export const unique = {
  params: ['list', 'caseSensitive'],
  validate(value, { list, caseSensitive }) {
    const l = caseSensitive ? list : list.map((a) => a.toLowerCase());
    const v = caseSensitive ? value : value.toLowerCase();

    return !l.includes(v);
  },
  message: '{_field_} must be unique'
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

  message: '{_field_} should be smaller than {target}'
};

export const dateAfter = {
  params: ['target'],
  validate(value, { target }) {
    if (!target) return true;

    const { currentDate, prevDates } = normalizeDates(value, target, null);

    return prevDates.some((d) => currentDate >= d);
  },

  message: '{_field_} should be greater than {target}'
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
    const prevDates = wrapInArray(prev);
    const nextDates = wrapInArray(next);

    if (!nextDates.length) {
      return `${name} should be after ${prevDates[0]}`;
    }
    if (!prevDates.length) {
      return `${name} should be before ${prevDates[0]}`;
    }

    return `${name} should be between ${prevDates[0]} and ${nextDates[0]}`;
  }
};

const install = (Vue, options = {}) => {
  if (install.installed) return;
  // eslint-disable-next-line no-unused-vars
  install.installed = true;

  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  extend('minMax', minMax);
  extend('minMaxValue', minMaxValue);
  extend('unique', unique);
  extend('required', required);
  extend('integer', integer);

  extend('dateBefore', dateBefore);
  extend('dateAfter', dateAfter);

  localize('en', en);
};

export const ValidationPlugin = {
  name: 'ValidationPlugin',
  install
};
