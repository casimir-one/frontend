import { blocksGenerator } from '@deip/vue-layout-schema';
import { defaultLayoutComponents } from '../default-layouts-components';

const {
  VDivider,
  VexMiniMetaItem,
  VexTooltip,
  VexVideoEmbed,
  VexTextExpand
} = defaultLayoutComponents;

export const uiBlocks = {
  title: 'Ui elements',
  blocks: blocksGenerator([
    {
      component: VDivider,
      icon: 'mdi-minus',
      blockType: 'component',
      children: []
    },
    {
      component: VexMiniMetaItem,
      icon: 'mdi-tag-text-outline',
      children: []
    },
    {
      component: VexTooltip,
      icon: 'mdi-tooltip-text-outline',
      children: []
    },
    {
      component: VexVideoEmbed,
      icon: 'mdi-video-outline',
      excludeProps: ['params'],
      children: []
    },
    {
      component: VexTextExpand,
      icon: 'mdi-text-short',
      children: []
    }
  ])
};
