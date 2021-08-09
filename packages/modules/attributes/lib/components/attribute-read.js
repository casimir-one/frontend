import { defineComponent } from '@deip/platform-util';
import {
  VexMarkdown
} from '@deip/vuetify-extended';
import { abstractAttributeFactory } from '../mixins/attribute';
import { ATTR_TYPES_READ_SCHEMAS } from '../schemas';

const AttributeRead = defineComponent({
  name: 'AttributeRead',

  mixins: [
    abstractAttributeFactory(
      ATTR_TYPES_READ_SCHEMAS,
      {
        VexMarkdown
      }
    )
  ]
});

export default AttributeRead;
export { AttributeRead };
