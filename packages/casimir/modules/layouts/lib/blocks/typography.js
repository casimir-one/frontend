// eslint-disable-next-line import/extensions,import/no-unresolved
import { createRange } from 'vuetify/lib/util/helpers';
import { normalizeBlocksObject } from '@deip/vue-layout-schema';

export const typographyBlocks = {
  title: 'Typography',
  blocks: normalizeBlocksObject([
    ...createRange(6)
      .map((val, index) => ({
        is: `h${index + 1}`,
        name: `Headline ${index + 1}`,
        icon: `mdi-format-header-${index + 1}`,
        data: {
          class: `text-h${index + 1}`
        },
        children: [],
        blockType: 'typography'
      })),
    {
      is: 'div',
      name: 'Subtitle 1',
      icon: 'mdi-format-title',
      data: {
        class: 'text-subtitle-1'
      },
      children: [],
      blockType: 'typography'
    },
    {
      is: 'div',
      name: 'Subtitle 2',
      icon: 'mdi-format-text',
      data: {
        class: 'text-subtitle-2'
      },
      children: [],
      blockType: 'typography'
    },
    {
      is: 'div',
      name: 'Base text 1',
      icon: 'mdi-text-subject',
      data: {
        class: 'text-body-1'
      },
      children: [],
      blockType: 'typography'
    },
    {
      is: 'div',
      name: 'Base text 2',
      icon: 'mdi-text-subject',
      data: {
        class: 'text-body-2'
      },
      children: [],
      blockType: 'typography'
    },
    {
      is: 'div',
      name: 'Caption',
      icon: 'mdi-closed-caption-outline',
      data: {
        class: 'text-caption'
      },
      children: [],
      blockType: 'typography'
    }
  ])
};
