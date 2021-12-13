import { blocksGenerator, normalizeBlocksObject } from '@deip/vue-layout-schema';
import { defaultLayoutComponents } from '../default-layouts-components';

const {
  VSimpleTable
} = defaultLayoutComponents;

export const tableBlocks = {
  title: 'Table',
  blocks: [
    ...blocksGenerator([
      {
        component: VSimpleTable,
        icon: 'mdi-table',
        children: []
      }
    ]),
    ...normalizeBlocksObject([
      {
        is: 'thead',
        name: 'Table header',
        icon: 'mdi-page-layout-header',
        children: []
      },
      {
        is: 'tbody',
        name: 'Table body',
        icon: 'mdi-page-layout-body',
        children: []
      },
      {
        is: 'tr',
        name: 'Table row',
        icon: 'mdi-table-row',
        children: []
      },
      {
        is: 'td',
        name: 'Table cell',
        icon: 'mdi-border-outside',
        data: {
          attrs: {
            title: { type: String },
            width: { type: String }
          }
        },
        children: []
      }
    ])
  ]
};
