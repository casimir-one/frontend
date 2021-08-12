import { merge } from 'lodash-es';

const getMessagesByLocales = (locales) => {
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });

  return messages;
};

export const setLocalesMessages = (i18n, locales) => {
  const messagesByLocales = getMessagesByLocales(locales);
  for (const [locale, messages] of Object.entries(messagesByLocales)) {
    const appMessages = i18n.getLocaleMessage(locale);
    i18n.setLocaleMessage(locale, merge(appMessages, messages));
  }
};
