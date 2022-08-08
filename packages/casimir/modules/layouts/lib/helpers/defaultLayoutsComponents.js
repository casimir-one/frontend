import { AttributeSet, AttributeRead } from '@deip/attributes-module';

import {
  VexHeader,
  VexSection,
  VexSectionSplit,
  VexMiniMetaItem,
  VexTooltip,
  VexVideoEmbed,
  VexAvatar,
  VexRichedit,
  VexTextExpand,
  VexScrollableText
// eslint-disable-next-line import/extensions,import/no-unresolved
} from '@deip/vuetify-extended';

// eslint-disable-next-line import/no-unresolved
import { VeStack, VeLineClamp } from '@deip/vue-elements';

import {
  VRow,
  VCol,
  VSheet,
  VSimpleTable,
  VIcon,
  VDivider,
  VImg,
  VCard
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { VueEditorjs } from '@deip/vue-editorjs';

export const defaultLayoutComponents = {
  // attributes
  AttributeSet,
  AttributeRead,

  // content
  VImg,
  VexVideoEmbed,
  VIcon,

  VueEditorjs,
  VexRichedit,

  // layout
  VexHeader,
  VexSection,
  VexSectionSplit,
  VeStack,
  VRow,
  VCol,
  VSheet,

  // table
  VSimpleTable,

  // ui
  VDivider,
  VexMiniMetaItem,
  VexTooltip,
  VCard,

  // other
  VexAvatar,

  // text
  VexTextExpand,
  VeLineClamp,
  VexScrollableText
};
