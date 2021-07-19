import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { enGB } from 'date-fns/locale';

const languages = {
  en: enGB
};

// TODO: move to @deip/platform-util composables
export const formatDateMixin = {
  methods: {
    formatDate(date, formatStr = 'PPP') {
      const currentLocale = this.$i18n?.locale || 'en';
      return format(date, formatStr, {
        locale: languages[currentLocale]
      });
    },
    formatDistance(date, baseDate, options) {
      const currentLocale = this.$i18n?.locale || 'en';
      return formatDistance(date, baseDate, {
        ...options,
        locale: languages[currentLocale]
      });
    },
    formatDistanceToNow(date, options) {
      const currentLocale = this.$i18n?.locale || 'en';
      return formatDistanceToNow(date, {
        ...options,
        locale: languages[currentLocale]
      });
    }
  }
};
