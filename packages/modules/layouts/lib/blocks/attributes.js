import { merge } from '@deip/toolbox/lodash';
import { blocksGenerator } from '@deip/schema-builder';
import { ATTR_TYPES_ICONS } from '@deip/attributes-service';

export const attributesBlocksFactory = (attributes, componentObject) => ({
  title: 'Attributes',
  blocks: blocksGenerator(attributes.map((attr) => ({
    ...merge(
      componentObject,
      {
        props: {
          attributeId: attr._id
        }
      }
    ),
    id: attr._id,
    blockName: attr.shortTitle || attr.title,
    icon: ATTR_TYPES_ICONS[attr.type],
    blockType: 'attribute',
    dataType: attr.type,
    model: `attributes.${attr._id}`,
    excludeProps: ['value', 'schemaData', 'proxyProps'],
    disabledProps: ['attributeId']
  })))
});
