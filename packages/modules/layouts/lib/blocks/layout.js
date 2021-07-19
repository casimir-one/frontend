import {
  VexHeader,
  VexSection,
  VexStack
// eslint-disable-next-line import/extensions,import/no-unresolved
} from '@deip/vuetify-extended';

import {
  VRow,
  VCol,
  VSheet
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { blocksGenerator } from '@deip/schema-builder';

export const layoutBlocks = {
  title: 'Layout',
  blocks: blocksGenerator([
    {
      ...VexHeader.options,
      icon: 'mdi-image-area',
      children: [],
      excludeProps: ['returnDominant']
    },
    {
      ...VexSection.options,
      icon: 'mdi-view-agenda-outline',
      children: []
    },
    {
      ...VSheet.options,
      blockName: 'Container',
      icon: 'mdi-card-outline',
      children: [],
      excludeProps: ['shaped', 'tile', 'elevation']
    },
    {
      ...VRow.options,
      icon: 'mdi-view-grid-outline',
      children: [],
      blockType: 'row'
    },
    {
      ...VCol.options,
      icon: 'mdi-view-grid-plus-outline',
      children: []
    },
    {
      ...VexStack.options,
      icon: 'mdi-view-sequential-outline',
      children: []
    }

  ])
};
