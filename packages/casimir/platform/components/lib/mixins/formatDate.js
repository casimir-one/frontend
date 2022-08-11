import {
  format,
  formatDistance,
  formatDistanceToNow,
  parseISO
} from 'date-fns';
import { enGB } from 'date-fns/locale';
import { isString } from '@casimir/toolbox';

const languages = {
  en: enGB
};

// TODO: move to @casimir/platform-util composables
export const dateMixin = {
  methods: {
    /**
     * Format date
     * @param {Date} date
     * @param {string} [formatStr=PPP]
     * @returns {string} formatted date
     */
    $$formatDate(date, formatStr = 'PPP') {
      const currentLocale = this.$i18n?.locale || 'en';
      return format(date, formatStr, {
        locale: languages[currentLocale]
      });
    },

    /**
     * Format distance between dates
     * @param {Date} date
     * @param {Date} baseDate
     * @param {Object} options
     * @returns {string} formatted distance between dates
     */
    $$formatDistance(date, baseDate, options) {
      const currentLocale = this.$i18n?.locale || 'en';
      return formatDistance(date, baseDate, {
        ...options,
        locale: languages[currentLocale]
      });
    },

    /**
     * Format distance between date and now
     * @param {Date} date
     * @param {Object} options
     * @returns {string} formatted distance between date and now
     */
    $$formatDistanceToNow(date, options) {
      const currentLocale = this.$i18n?.locale || 'en';
      return formatDistanceToNow(date, {
        ...options,
        locale: languages[currentLocale]
      });
    },

    /**
     * Parse string date in ISO
     * @param {string} dateString
     * @param {boolean} [convertToUtc=true]
     * @param {Object} options
     * @param {number} [options.additionalDigits=2]
     * @returns {Date} parsed date
     */
    $$parseISO(dateString, convertToUtc = false, options = { additionalDigits: 2 }) {
      if (!dateString) {
        return parseISO(dateString, options);
      }

      return convertToUtc ? parseISO(`${dateString}Z`, options) : parseISO(dateString, options);
    },

    /**
     * Format date in ISO
     * @param {Date} date
     * @returns {string} formatted date
     */
    $$formatISO(date) {
      let dateToParse = date;
      if (isString(date)) {
        dateToParse = new Date(date);
      }

      return `${dateToParse.toISOString().split('.')[0]}`;
    }
  }
};
