import { defineComponent } from '@deip/platform-util';
import { VlsParser } from '@deip/vue-layout-schema';
import { isFile, wrapInArray } from '@deip/toolbox';

export const abstractAttributeFactory = (
  schemas = [],
  components = {},
  area = 'set'
) => defineComponent({
  name: 'AttributeAbstract',

  props: {
    attributeId: {
      type: String,
      required: true
    },

    schemaData: {
      type: Object,
      default: () => ({})
    },

    proxyProps: {
      type: Object,
      default: () => ({})
    },

    components: {
      type: Object,
      default: () => ({})
    },

    value: {
      type: [String, Number, Array, Object, Boolean, File],
      default: null
    }
  },

  computed: {
    attributeInfo() {
      return this.$store.getters['attributes/one'](this.attributeId);
    },

    internalSchema() {
      return this.attributeInfo?.schemas?.[area]
        || schemas[this.attributeInfo.type]
        || schemas.fallback
        || { is: 'div', text: `${this.attributeInfo.title} need [${area}] schema` };
    },

    internalSchemaData() {
      const value = this.schemaData?.data?.attributes?.[this.attributeId];

      return {
        ...this.schemaData,
        attribute: {
          info: this.attributeInfo,
          value: isFile(value) ? value.name : value
        },
        proxyProps: this.proxyProps
      };
    },

    internalComponents() {
      return {
        ...components,
        ...this.components
      };
    },

    normalisedSchema() {
      return wrapInArray(this.internalSchema);
    }
  },

  methods: {

    genAttribute() {
      const { isMultiple } = this.attributeInfo;

      if (isMultiple) {
        return (
          <div>Multiple attrimute placeholder</div>
        );
      }

      return (
        <VlsParser
          schema={this.normalisedSchema}
          schemaData={this.internalSchemaData}
          components={this.internalComponents}
        />
      );
    }
  },

  render() {
    if (this.attributeInfo) {
      return (
        this.genAttribute()
      );
    }

    return (
      <div>Attribute not exist</div>
    );
  }
});
