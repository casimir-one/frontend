import currency from 'currency.js';

import { isNumber, isObject, isString } from '@deip/toolbox';

const DEFAULT_PRECISION = 3;

export const assetsMixin = {
  methods: {
    $$fromAssetUnits(val = '') {
      if (val.indexOf('.') === -1) {
        const [stringAmount, assetId = this.$env.ASSET_UNIT] = val.split(' ');
        const amount = stringAmount ? parseInt(stringAmount, 10) : 0;
        const precision = 0;

        return {
          stringAmount,
          amount,
          precision,
          assetId
        };
      }

      const matches = val.match(/^(\d+\.\d+)\s([a-zA-Z]+)/);
      const stringAmount = matches[1];
      const amount = stringAmount ? parseFloat(stringAmount) : 0;
      const precision = stringAmount ? stringAmount.split('.')[1].length : DEFAULT_PRECISION;
      const assetId = matches[2] || this.$env.ASSET_UNIT;

      return {
        stringAmount,
        amount,
        precision,
        assetId
      };
    },

    $$formatCurrencyOpts(obj = {}, options = {}, formatted = true) {
      const formatOptions = {
        precision: DEFAULT_PRECISION,
        symbol: this.$env.ASSET_UNIT,

        separator: formatted ? ',' : '',
        pattern: '# !', // # - amount, ! - symbol
        negativePattern: '-# !'
      };

      return {
        ...formatOptions,
        ...obj,
        ...options
      };
    },

    $$toAssetUnits(val, formatted = true, options = {}) {
      if (!val) return null;

      if (isString(val) || isNumber(val)) {
        const formattedOpts = this.$$formatCurrencyOpts({}, options, formatted);
        return currency(val, formattedOpts).format();
      }

      if (isObject(val)) {
        const { amount, assetId, precision = DEFAULT_PRECISION } = val;

        if (!amount && amount !== 0) return null;
        const formattedOpts = this.$$formatCurrencyOpts({
          precision,
          symbol: assetId
        }, options, formatted);

        return currency(amount, formattedOpts).format();
      }

      throw new Error('Unknown asset format');
    }
  }
};
