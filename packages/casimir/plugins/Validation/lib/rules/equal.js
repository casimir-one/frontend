import { proxydi } from '@casimir.one/proxydi';

export const equal = {
  params: ['target', 'label'],
  /**
 * Returns true if value is equal to target value
 * @param {any} value
 * @param {Object} args
 * @param {any} args.target
 * @returns {boolean} Value is equal to target value
 */
  validate(value, { target }) {
    return value === target;
  },
  message(_, values) {
    const i18n = proxydi.get('i18n');
    return i18n.t('plugin.validation.equal', values);
  }
};
