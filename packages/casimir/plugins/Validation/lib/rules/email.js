import { proxydi } from '@casimir.one/proxydi';

export const email = {
  /**
 * Returns true if given email is correct
 * @param {string} value
 * @returns {boolean} Given email is correct
 */
  validate(value) {
    const patternStr = ['^(([^<>()[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)',
      '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
      '[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+',
      '[a-zA-Z]{2,}))$'].join('');
    const pattern = new RegExp(patternStr);

    return pattern.test(value) && value.split('@')[0].length <= 64;
  },

  message(_, values) {
    const i18n = proxydi.get('i18n');
    return i18n.t('plugin.validation.email', values);
  }
};
