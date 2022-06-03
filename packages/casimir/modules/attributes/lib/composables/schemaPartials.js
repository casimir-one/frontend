import { blocksGenerator, normalizeBlocksObject } from '@deip/vue-layout-schema';
import { VeStack } from '@deip/vue-elements';
import {
  VTextField,
  VTextarea,
  VSwitch,
  VCheckbox,
  VSelect,
  VCol,
  VRow
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { VexDateInput } from '@deip/vuetify-extended';

import { cloneDeep } from 'lodash';
import {
  pascalCase, isObject, RecursiveIterator, camelCase
} from '@deip/toolbox';
import { defaultBreakpoints } from '@deip/vue-elements/lib/util/breakpoint';

const contentBlocksData = [
  {
    is: 'span',
    name: 'Text',
    icon: 'mdi-text',
    blockType: 'content',
    text: ''
  }
];

/**
 * @type {Object[]}
 */
const layoutBlocksData = [
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
    icon: 'mdi-view-sequential-outline',
    children: [],
    propsValues: {
      ...defaultBreakpoints.reduce((acc, bp) => ({
        ...acc,
        ...{
          [camelCase(`flow-${bp}`)]: ['row', 'column']
        }
      }), { flow: ['row', 'column'] })
    }
  }
];

/**
 * @type {Object[]}
 */
const formBlocksData = [
  {
    component: VTextField,
    icon: 'mdi-form-textbox',
    blockType: 'component',
    includeProps: ['hint', 'label', 'placeholder', 'prefix', 'suffix'],
    model: 'VTextField'
  },
  {
    component: VTextarea,
    icon: 'mdi-form-textarea',
    blockType: 'component',
    includeProps: ['hint', 'label', 'placeholder', 'prefix', 'suffix'],
    model: 'VTextarea'
  },
  {
    component: VSwitch,
    icon: 'mdi-toggle-switch-off-outline',
    blockType: 'component',
    includeProps: ['hint', 'label'],
    model: 'VSwitch'
  },
  {
    component: VCheckbox,
    icon: 'mdi-checkbox-marked-outline',
    blockType: 'component',
    includeProps: ['hint', 'label'],
    model: 'VSwitch'
  },
  {
    component: VSelect,
    icon: 'mdi-form-dropdown',
    blockType: 'component',
    includeProps: ['hint', 'label', 'placeholder', 'prefix', 'suffix', 'items'],
    model: 'VSelect'
  },
  {
    component: VexDateInput,
    icon: 'mdi-calendar',
    blockType: 'component',
    includeProps: ['label'],
    model: 'VexDateInput'
  }
];

/**
 * @type {Object}
 */
export const schemaLayoutComponents = layoutBlocksData.reduce((acc, i) => {
  const result = acc;
  result[pascalCase(i.component.options.name)] = i.component;
  return result;
}, {});

/**
 * @type {Object}
 */
export const schemaFormComponents = formBlocksData.reduce((acc, i) => {
  const result = acc;
  result[pascalCase(i.component.options.name)] = i.component;
  return result;
}, {});

/**
 * @type {Object}
 */
export const contentBlocks = {
  title: 'Content',
  blocks: normalizeBlocksObject(contentBlocksData)
};

/**
 * @type {Object}
 */
export const layoutBlocks = {
  title: 'Layout',
  blocks: blocksGenerator(layoutBlocksData)
};

/**
 * @type {Object}
 */
export const formBlocks = {
  title: 'Form',
  blocks: blocksGenerator(formBlocksData)
};

/**
 * Generate schema blocks according to "edit" schema inputs
 * @param {Object[]} [schema=[]]
 * @return {{blockType: string, icon: string, name: string, is: string, text: string}}
 */
export const genReflectedFormBlocks = (schema) => {
  const clone = cloneDeep(schema);
  const result = {
    title: 'Attribute data',
    blocks: []
  };

  for (const { node } of new RecursiveIterator(clone, 1, true)) {
    if (isObject(node) && !!node.model) {
      const { model, id, data: { props: { label } } } = node;
      const { icon } = formBlocks.blocks.find((b) => b.id === id);

      result.blocks.push({
        is: 'div',
        text: `{{attribute.value.${model}}}`,
        icon,
        name: label,
        blockType: 'value'
      });
    }
  }
  return result;
};
