import { proxydi } from '@deip/proxydi';

export const minValue = {
  params: ['target'],
  /**
 * Returns true if value is greater than or equal to target value
 * @param {number} value
 * @param {Object} args
 * @param {number} args.target
 * @returns {boolean} Value is greater than or equal to target value
 */
  validate(value, { target }) {
    const v = parseFloat(value);
    return v >= target;
  },

  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.minValue', values);
  }
};
