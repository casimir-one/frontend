import { proxydi } from '@casimir.one/proxydi';

export const unique = {
  params: ['list', 'caseSensitive'],
  /**
 * Returns true if given value is unique
 * @param {string} value
 * @param {Object} args
 * @param {Array.<string>} args.list
 * @param {boolean} args.caseSensitive
 * @returns {boolean}
 */
  validate(value, { list, caseSensitive }) {
    const l = caseSensitive ? list : list.map((a) => a.toLowerCase());
    const v = caseSensitive ? value : value.toLowerCase();

    return !l.includes(v);
  },
  message(_, values) {
    const i18n = proxydi.get('i18n');
    return i18n.t('plugin.validation.unique', values);
  }
};
