import { proxydi } from '@deip/proxydi';
import { getAttributeFileSrc } from '@deip/platform-fns';
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
          getGlobal: (key, attrs) => {
            const attributeId = this.$store.getters['attributes/map'](key);
            return attrs.find((attr) => attr.attributeId === attributeId);
          },

          getFileSrc: (opts = {}) => getAttributeFileSrc({
            serverUrl: this.$env.DEIP_SERVER_URL,
            ...opts
          })
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
