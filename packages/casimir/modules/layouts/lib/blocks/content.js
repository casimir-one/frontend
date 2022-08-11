import { blocksGenerator, normalizeBlocksObject } from '@casimir/vue-layout-schema';
import { defaultLayoutComponents } from '../helpers/defaultLayoutsComponents';

const {
  VexVideoEmbed,
  VImg
} = defaultLayoutComponents;

export const contentBlocks = {
  title: 'Content',
  blocks: [
    ...normalizeBlocksObject([
      {
        is: 'span',
        name: 'Text',
        icon: 'mdi-text',
        blockType: 'content',
        text: ''
      }
    ]),
    ...blocksGenerator([
      {
        component: VImg,
        blockName: 'Image',
        icon: 'mdi-image-outline',
        blockType: 'component'
      },
      {
        component: VexVideoEmbed,
        blockName: 'Video',
        icon: 'mdi-video-outline',
        excludeProps: ['params'],
        blockType: 'component'
      }
    ])
  ]
};
