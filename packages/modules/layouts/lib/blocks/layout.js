import { blocksGenerator } from '@deip/schema-builder';
import { defaultLayoutComponents } from '../default-layouts-components';

const {
  VexHeader,
  VexSection,
  VexSectionSplit,
  VexStack,
  VRow,
  VCol,
  VSheet
} = defaultLayoutComponents;

export const layoutBlocks = {
  title: 'Layout',
  blocks: blocksGenerator([
    {
      component: VexHeader,
      icon: 'mdi-image-area',
      children: [],
      excludeProps: ['returnDominant']
    },
    {
      component: VexSection,
      icon: 'mdi-view-agenda-outline',
      children: []
    },
    {
      component: VexSectionSplit,
      icon: 'mdi-view-week-outline',
      blockType: 'row',
      children: []
    },
    {
      component: VSheet,
      blockName: 'Container',
      icon: 'mdi-card-outline',
      children: [],
      excludeProps: ['shaped', 'tile', 'elevation']
    },
    {
      component: VRow,
      icon: 'mdi-view-grid-outline',
      children: [],
      blockType: 'row'
    },
    {
      component: VCol,
      icon: 'mdi-view-grid-plus-outline',
      children: []
    },
    {
      component: VexStack,
      icon: 'mdi-view-sequential-outline',
      children: []
    }

  ])
};
