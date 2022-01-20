import { proxydi } from '@deip/proxydi';
import { wrapInArray } from '@deip/toolbox';

import { normalizeDates } from '../helpers';

export const dateBetween = {
  params: ['prev', 'next'],
  /**
 * Returns true if date is between two given dates
 * @param {Date} value
 * @param {Object} args
 * @param {Date} args.next
 * @param {Date} args.prev
 * @returns {boolean} Date is between two given dates
 */
  validate(value, { prev, next }) {
    const { currentDate, prevDates, nextDates } = normalizeDates(value, prev, next);

    if (prevDates.length && nextDates.length) {
      return prevDates.some((d) => currentDate >= d)
        && nextDates.some((d) => currentDate <= d);
    }

    if (prevDates.length && !nextDates.length) {
      return prevDates.some((d) => currentDate >= d);
    }

    if (!prevDates.length && nextDates.length) {
      nextDates.some((d) => currentDate <= new Date(d));
    }

    return true;
  },

  message(name, { prev, next }) {
    const i18n = proxydi.get('i18n');
    const prevDates = wrapInArray(prev);
    const nextDates = wrapInArray(next);

    if (!nextDates.length) {
      return i18n.t('plugin.validation.dateBetween.after', { date: prevDates[0] });
    }
    if (!prevDates.length) {
      return i18n.t('plugin.validation.dateBetween.before', { date: nextDates[0] });
    }

    return i18n.t('plugin.validation.dateBetween.between',
      {
        prev: prevDates[0],
        next: nextDates[0]
      });
  }
};
