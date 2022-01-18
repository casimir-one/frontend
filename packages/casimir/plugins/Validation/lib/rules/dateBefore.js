import { proxydi } from '@deip/proxydi';

import { normalizeDates } from './helpers';

export const dateBefore = {
  params: ['target'],
  /**
 * Returns true if date is before target date
 * @param {Date} value
 * @param {Object} args
 * @param {Date} args.target
 * @returns {boolean} Date is before target date
 */
  validate(value, { target }) {
    if (!target) return true;

    const { currentDate, nextDates } = normalizeDates(value, null, target);

    return nextDates.some((d) => currentDate < d);
  },

  message(_, values) {
    const i18n = proxydi.get('i18nInstance');
    return i18n.t('plugin.validation.dateBefore', values);
  }
};
