import {
  VIcon,
  VDivider
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import {
  VexMiniMetaItem,
  VexTooltip,
  VexVideoEmbed
  // eslint-disable-next-line import/extensions,import/no-unresolved
} from '@deip/vuetify-extended';

import { blocksGenerator } from '@deip/schema-builder';

export const uiBlocks = {
  title: 'Ui elements',
  blocks: blocksGenerator([
    {
      ...VIcon.options,
      icon: 'mdi-star-box-outline',
      children: []
    },
    {
      ...VDivider.options,
      icon: 'mdi-minus',
      children: []
    },
    {
      ...VexMiniMetaItem,
      icon: 'mdi-tag-text-outline',
      children: []
    },
    {
      ...VexTooltip,
      icon: 'mdi-tooltip-text-outline',
      children: []
    },
    {
      ...VexVideoEmbed,
      icon: 'mdi-video-outline',
      excludeProps: ['params'],
      children: []
    }
  ])
};
