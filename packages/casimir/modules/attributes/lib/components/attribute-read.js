import { defineComponent } from '@deip/platform-util';

import {
  VexMarkdown
} from '@deip/vuetify-extended';

import {
  VCol,
  VRow
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { abstractAttributeFactory } from '../mixins/attribute';
import { ATTR_TYPES_READ_SCHEMAS } from '../schemas';

const AttributeRead = defineComponent({
  name: 'AttributeRead',

  mixins: [
    abstractAttributeFactory(
      ATTR_TYPES_READ_SCHEMAS,
      {
        VexMarkdown,

        VCol,
        VRow
      },
      'read'
    )
  ]
});

export default AttributeRead;
export { AttributeRead };
