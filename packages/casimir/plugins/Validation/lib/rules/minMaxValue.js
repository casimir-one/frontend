import { proxydi } from '@deip/proxydi';

export const minMaxValue = {
  params: ['min', 'max'],
  /**
 * Returns true if given value is greater than or equal to
 * the given minimum and less than or equal to the given maximum
 * @param {number} value
 * @param {Object} args
 * @param {number} args.min
 * @param {number} args.max
 * @returns {boolean}
 */
  validate(value, { min, max }) {
    const v = parseFloat(value);
    return v >= min && v <= max;
  },

  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.minMaxValue', values);
  }
};
