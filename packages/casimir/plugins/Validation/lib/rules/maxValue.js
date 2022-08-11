import { proxydi } from '@casimir/proxydi';

export const maxValue = {
  params: ['target'],
  /**
 * Returns true if value is less than or equal to target value
 * @param {number} value
 * @param {Object} args
 * @param {number} args.target
 * @returns {boolean} Value is less than or equal to target value
 */
  validate(value, { target }) {
    const v = parseFloat(value);
    return v <= target;
  },

  message(_, values) {
    const i18n = proxydi.get('i18n');
    return i18n.t('plugin.validation.maxValue', values);
  }
};
