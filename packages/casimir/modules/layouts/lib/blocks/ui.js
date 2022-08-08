import { blocksGenerator } from '@deip/vue-layout-schema';
import { defaultLayoutComponents } from '../helpers/defaultLayoutsComponents';

const {
  VDivider,
  VCard,
  VexMiniMetaItem,
  VexTooltip,
  VexTextExpand,
  VexScrollableText
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
    },
    {
      component: VexScrollableText,
      blockName: 'ScrollableText',
      icon: 'mdi-script-text-outline ',
      children: []
    },
    {
      component: VCard,
      blockName: 'Card',
      icon: 'mdi-card-text-outline',
      includeProps: [
        'elevation',
        'height',
        'width',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'rounded',
        'outlined'
      ],
      children: []
    }
  ])
};
