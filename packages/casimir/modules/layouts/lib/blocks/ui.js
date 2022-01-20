import { blocksGenerator } from '@deip/vue-layout-schema';
import { defaultLayoutComponents } from '../helpers/defaultLayoutsComponents';

const {
  VDivider,
  VexMiniMetaItem,
  VexTooltip,
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
      blockName: 'Meta item',
      icon: 'mdi-tag-text-outline',
      excludeProps: ['meta', 'title'],
      blockType: 'component'
    },
    {
      component: VexTooltip,
      icon: 'mdi-tooltip-text-outline',
      children: []
    },
    {
      component: VexTextExpand,
      blockName: 'Expand',
      icon: 'mdi-text-box-plus-outline',
      children: []
    }
  ])
};
