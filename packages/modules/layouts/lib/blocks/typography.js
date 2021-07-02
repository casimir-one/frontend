// eslint-disable-next-line import/extensions,import/no-unresolved
import { createRange } from 'vuetify/lib/util/helpers';
import { normalizeBlocksObject } from '@deip/schema-builder';

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
      name: 'Base text',
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
