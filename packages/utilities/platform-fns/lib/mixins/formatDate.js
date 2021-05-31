import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

const languages = {
  en: enGB
};

export const formatDateMixin = {
  methods: {
    formatDate(date, formatStr = 'PPP') {
      const currentLocale = this.$i18n ? this.$i18n.locale : 'en';
      return format(date, formatStr, {
        locale: languages[currentLocale]
      });
    }
  }
};
