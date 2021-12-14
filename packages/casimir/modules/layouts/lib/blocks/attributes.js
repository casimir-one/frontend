import { blocksGenerator } from '@deip/vue-layout-schema';
import { ATTR_TYPES_ICONS, ATTR_TYPES_PROPS } from '@deip/constants';

export const attributesBlocksFactory = (attributes, component) => {
  const acc = attributes.map((attr) => {
    const icon = ATTR_TYPES_ICONS[attr.type];
    const proxyProps = ATTR_TYPES_PROPS[attr.type];

    return {
      component,
      data: {
        props: {
          attributeId: attr._id
        },
        ...(proxyProps ? { proxyProps } : {})
      },
      blockName: attr.shortTitle || attr.title,
      id: attr._id,
      icon,
      blockType: 'attribute',
      dataType: attr.type,
      model: `attributes.${attr._id}`,
      excludeProps: ['value', 'schemaData', 'components'],
      disabledProps: ['attributeId']
    };
  });

  return {
    title: 'Attributes',
    blocks: blocksGenerator(acc)
  };
};
