import { defineComponent } from '@deip/platform-util';
import { abstractAttributeFactory } from '../mixins/attribute';
import { ATTR_TYPES_READ_SCHEMAS } from '../schemas';

const AttributeRead = defineComponent({
  name: 'AttributeRead',

  mixins: [
    abstractAttributeFactory(
      ATTR_TYPES_READ_SCHEMAS
    )
  ]
});

export default AttributeRead;
export { AttributeRead };
