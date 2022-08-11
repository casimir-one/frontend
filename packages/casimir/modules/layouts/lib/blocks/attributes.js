import { blocksGenerator } from '@casimir/vue-layout-schema';
import { AttributeSet, AttributeRead } from '@casimir/attributes-module';

/**
 * Attributes blocks factory
 * @param {Object} opts
 * @param {Array.<Object>} opts.attributes
 * @param {Array.<Object>} opts.registry
 * @returns {Object}
 */
export const attributesBlocksFactory = (opts) => {
  const {
    attributes,
    registry
  } = opts;

  const components = [
    { render: AttributeRead, layoutType: ['details'], componentType: 'read' },
    { render: AttributeSet, layoutType: ['form'], componentType: 'set' }
  ];

  const rawBocks = components
    .reduce((
      acc,
      component
    ) => {
      const res = attributes.map((attr) => {
        const attribute = registry.find((a) => a.type === attr.type) || {};

        const {
          icon = 'mdi-cancel',
          proxyProps: coreProxyProps = {},
          components: { [component.componentType]: componentInfo = {} } = {}
        } = attribute;

        const { proxyProps: componentProxyProps = {} } = componentInfo;

        const proxyProps = { ...coreProxyProps, ...componentProxyProps };

        const data = {
          props: { attributeId: attr._id },
          ...(Object.keys(proxyProps).length ? { proxyProps } : {})
        };

        return {
          component: component.render,
          data,
          blockName: attr.shortTitle || attr.title,
          id: attr._id,
          icon,
          blockType: 'attribute',
          dataType: attr.type,
          model: `attributes.${attr._id}`,
          excludeProps: ['value', 'schemaData', 'components'],
          disabledProps: ['attributeId'],
          scope: attr.scope,
          layoutType: component.layoutType
        };
      });

      return [...acc, ...res];
    }, []);

  return blocksGenerator(rawBocks);
};
