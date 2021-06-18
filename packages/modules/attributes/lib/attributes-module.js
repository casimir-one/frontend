import { proxydi } from '@deip/proxydi';
import { getAttributeFileSrc } from '@deip/platform-fns';
import {
  ATTR_SCOPES, ATTR_SCOPES_LABELS, ATTR_TYPES, ATTR_TYPES_LABELS
} from '@deip/attributes-service';
import { attributesStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('attributes', attributesStore);
    store.dispatch('attributes/getList');
    store.dispatch('attributes/getSettings');

    Object.defineProperty(Vue.prototype, '$attributes', {
      get() {
        return {
          getMappedData: (key, attrs) => {
            const attributeId = this.$store.getters['attributes/mappedId'](key);

            return attributeId
              ? attrs.find((attr) => attr.attributeId === attributeId)
              : null;
          },

          getMappedInfo: (key) => {
            const attributeId = this.$store.getters['attributes/mappedId'](key);

            return attributeId
              ? this.$store.getters['attributes/one'](attributeId)
              : null;
          },

          getFileSrc: (opts = {}) => getAttributeFileSrc({
            serverUrl: this.$env.DEIP_SERVER_URL,
            ...opts
          }),

          SCOPES: ATTR_SCOPES,
          SCOPES_LABELS: ATTR_SCOPES_LABELS,

          TYPES: ATTR_TYPES,
          TYPES_LABELS: ATTR_TYPES_LABELS
        };
      }
    });
  } else {
    throw Error('[AttributesModule]: storeInstance is not provided');
  }
};

export const AttributesModule = {
  name: 'AttributesModule',
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',
    'EnvModule'
  ],
  install
};
