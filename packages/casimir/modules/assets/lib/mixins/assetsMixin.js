import currency from 'currency.js';

import { isNil } from '@deip/toolbox/lodash';
import { isNumber, isObject, isString } from '@deip/toolbox';

export const assetsMixin = {
  methods: {
    /**
     * Create options object for currency.js
     * @param {Object} value
     * @param {Object} options
     * @param {Boolean} isFormatted
     * @returns {Object} options for currency.js
     */
    $$makeCurrencyOptions(value = {}, options = {}, isFormatted = true) {
      const defaultCurrencyOptions = {
        precision: 0,
        symbol: '',

        separator: isFormatted ? ',' : '',
        pattern: '# !', // # - amount, ! - symbol
        negativePattern: '-# !'
      };

      return {
        ...defaultCurrencyOptions,
        ...value,
        ...options
      };
    },

    /**
     * Format asset
     * @param {Object | string | number} value
     * @param {Boolean} isFormatted
     * @param {Object | undefined} options
     * @returns {string}
     */
    $$formatAsset(value, isFormatted = true, options = {}) {
      if (isNil(value)) return null;

      if (isString(value) || isNumber(value)) {
        const currencyOptions = this.$$makeCurrencyOptions({}, options, isFormatted);
        return currency(value, currencyOptions).format();
      }

      if (isObject(value)) {
        const { amount = 0, symbol, precision } = value;

        const currencyOptions = this.$$makeCurrencyOptions({
          precision,
          symbol
        }, options, isFormatted);

        return currency(amount, currencyOptions).format();
      }

      throw new Error('Unknown asset format');
    }
  }
};
