import {
  VSimpleTable
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { blocksGenerator, normalizeBlocksObject } from '@deip/schema-builder';

export const tableBlocks = {
  title: 'Table',
  blocks: [
    ...blocksGenerator([
      {
        ...VSimpleTable.options,
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
