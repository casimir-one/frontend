import { AttributeSet, AttributeRead } from '@deip/attributes-module';

import {
  VexHeader,
  VexSection,
  VexSectionSplit,
  VexStack,
  VexMiniMetaItem,
  VexTooltip,
  VexVideoEmbed,
  VexAvatar,
  VexRichedit
// eslint-disable-next-line import/extensions,import/no-unresolved
} from '@deip/vuetify-extended';

import { VeStack, VeLineClamp } from '@deip/vue-elements';

import {
  VRow,
  VCol,
  VSheet,
  VSimpleTable,
  VIcon,
  VDivider
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import VueEditorjs from '@deip/vue-editorjs';

export const defaultLayoutComponents = {
  // attributes
  AttributeSet,
  AttributeRead,

  // layout
  VexHeader,
  VexSection,
  VexSectionSplit,
  VexStack,
  VeStack,
  VRow,
  VCol,
  VSheet,

  // table
  VSimpleTable,

  // ui
  VIcon,
  VDivider,
  VexMiniMetaItem,
  VexTooltip,
  VexVideoEmbed,

  // other
  VexAvatar,

  // text
  VeLineClamp,
  VueEditorjs,
  VexRichedit
};
