import currency from 'currency.js';

import { isNumber, isObject, isString } from '@deip/toolbox';

export const assetsMixin = {
  methods: {
    $$fromAssetUnits(val) {
      if (val.indexOf('.') === -1) {
        const [stringAmount, assetId] = val.split(' ');
        const amount = parseInt(stringAmount, 10);
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
      const precision = stringAmount ? stringAmount.split('.')[1].length : 3;
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
        precision: 3,
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
        const { amount, assetId, precision } = val;

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
