import { proxydi } from '@casimir.one/proxydi';

import { normalizeDates } from '../helpers';

export const dateAfter = {
  params: ['target'],
  /**
 * Returns true if date is after target date
 * @param {Date} value
 * @param {Object} args
 * @param {Date} args.target
 * @returns {Boolean} Date is after target date
 */
  validate(value, { target }) {
    if (!target) return true;

    const { currentDate, prevDates } = normalizeDates(value, target, null);

    return prevDates.some((d) => currentDate > d);
  },

  message(_, values) {
    const i18n = proxydi.get('i18n');
    return i18n.t('plugin.validation.dateAfter', values);
  }
};
