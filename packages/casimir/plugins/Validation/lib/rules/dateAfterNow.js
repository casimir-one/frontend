import { proxydi } from '@deip/proxydi';

import { normalizeDates } from '../helpers';

export const dateAfterNow = {
  /**
 * Returns true if date is after current date
 * @param {Date} value
 * @returns {boolean} Date is after current date
 */
  validate(value) {
    const { currentDate } = normalizeDates(value, null, null);

    return currentDate > Date.now();
  },

  message(_, values) {
    const i18n = proxydi.get('i18n');
    return i18n.t('plugin.validation.dateAfterNow', values);
  }
};
