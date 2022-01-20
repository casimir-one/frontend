import { layoutsStore, layoutsRegistry } from './store';

import {
  layoutBlocks,
  typographyBlocks,
  tableBlocks,
  uiBlocks, contentBlocks
} from './blocks';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    store,
    components = {},
    blocks = []
  } = options;

  if (store) {
    store.registerModule('layoutsRegistry', layoutsRegistry);
    store.commit('layoutsRegistry/addComponents', components);

    const blocksSections = [
      contentBlocks,
      layoutBlocks,
      typographyBlocks,
      tableBlocks,
      uiBlocks,
      ...blocks
    ];

    for (const blocksSection of blocksSections) {
      store.commit('layoutsRegistry/addBlocks', blocksSection);
    }

    store.registerModule('layouts', layoutsStore);
    store.dispatch('layouts/getList');
    store.dispatch('layouts/getSettings');

    Object.defineProperty(Vue.prototype, '$layouts', {
      get() {
        return {
          getMappedData: (key) => {
            const id = this.$store.getters['layouts/mappedId'](key);

            return id
              ? this.$store.getters['layouts/one'](id)
              : null;
          }
        };
      }
    });
  } else {
    throw Error('[LayoutsModule]: storeInstance is not provided');
  }
};

export const LayoutsModule = {
  name: 'LayoutsModule',
  deps: [
    'EnvModule',
    'AttributesModule'
  ],
  install
};
