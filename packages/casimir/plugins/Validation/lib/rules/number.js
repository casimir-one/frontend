import { integer, double } from 'vee-validate/dist/rules';
import { proxydi } from '@deip/proxydi';

export const number = {
  /**
 * Returns true if value is integer or double
 * @param {number} value
 * @returns {boolean} Value is integer or double
 */
  validate(value) {
    return integer.validate(value) || double.validate(value);
  },
  message: (_, values) => {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.number', values);
  }
};
