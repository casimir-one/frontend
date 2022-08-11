import { blocksGenerator } from '@casimir/vue-layout-schema';
import { defaultBreakpoints } from '@casimir/vue-elements/lib/util/breakpoint';
import { camelCase } from '@casimir/toolbox';
import { defaultLayoutComponents } from '../helpers/defaultLayoutsComponents';

const {
  VexHeader,
  VexSection,
  VexSectionSplit,
  VeStack,
  VRow,
  VCol,
  VSheet
} = defaultLayoutComponents;

export const layoutBlocks = {
  title: 'Layout',
  blocks: blocksGenerator([
    {
      component: VexHeader,
      icon: 'mdi-page-layout-header',
      children: [],
      excludeProps: ['returnDominant'],
      allowedFor: {
        mode: [],
        scope: []
      }
    },
    {
      component: VexSection,
      icon: 'mdi-page-layout-body',
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
      component: VeStack,
      propsValues: {
        ...defaultBreakpoints.reduce((acc, bp) => ({
          ...acc,
          ...{
            [camelCase(`flow-${bp}`)]: ['row', 'column']
          }
        }), { flow: ['row', 'column'] })
      },
      blockName: 'Stack',
      icon: 'mdi-view-sequential-outline',
      children: []
    }
  ])
};
