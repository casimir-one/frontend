import { proxydi } from '@deip/proxydi';

export const minMax = {
  params: ['min', 'max'],
  /**
 * Returns true if the length of the given array is greater than or equal to
 * the given minimum and less than or equal to the given maximum
 * @param {Array} value
 * @param {Object} args
 * @param {number} args.min
 * @param {number} args.max
 * @returns {boolean}
 */
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },

  message(_, values) {
    const i18n = proxydi.get('i18n');
    return i18n.t('plugin.validation.minMax', values);
  }
};
