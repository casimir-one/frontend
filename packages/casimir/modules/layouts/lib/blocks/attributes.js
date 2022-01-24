import { blocksGenerator } from '@deip/vue-layout-schema';

export const attributesBlocksFactory = (opts = {}) => {
  const {
    attributes,
    component,
    registry
  } = opts;

  const acc = attributes.map((attr) => {
    const {
      icon = 'mdi-cancel',
      proxyProps
    } = registry.find((a) => a.type === attr.type) || {};

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
