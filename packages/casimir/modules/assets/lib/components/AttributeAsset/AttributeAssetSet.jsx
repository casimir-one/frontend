import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '@deip/attributes-module';
import { AssetInput } from '../AssetInput';

/**
 * Component for changing asset attribute
 */
export default defineComponent({
  name: 'AttributeAssetSet',

  components: { AssetInput },

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing asset field
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <AssetInput
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          required={this.attributeInfo.isRequired}
          errorMessages={errors}
          { ...{ props: this?.proxyProps?.AssetInput || {} }}
        />
      );
    }
  }
});
