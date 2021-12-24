import { proxydi } from '@deip/proxydi';
import { layoutsStore } from './store';
import { LayoutsRegistry } from './registry';

import {
  layoutBlocks,
  typographyBlocks,
  tableBlocks,
  uiBlocks, contentBlocks
} from './blocks';

const layoutsRegistry = LayoutsRegistry.getInstance();

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    blocks = [],
    blockSections = [],
    blockObjects = [],
    components = {}
  } = options;

  layoutsRegistry
    .registerBlocksObjects([
      contentBlocks,
      layoutBlocks,
      typographyBlocks,
      tableBlocks,
      uiBlocks,
      {
        title: 'Components',
        blocks
      }
    ])
    .registerBlocksSections(blockSections)
    .registerBlocksObjects(blockObjects)
    .registerComponents(components);

  const store = proxydi.get('storeInstance');

  if (store) {
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
    'VuetifyExtended',
    'EnvModule',
    'AttributesModule'
  ],
  install
};
