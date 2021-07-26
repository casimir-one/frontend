import { defineComponent } from '@deip/platform-util';
import { SchemaRenderer } from '@deip/schema-renderer';
import { isFile, wrapInArray } from '@deip/toolbox';

export const abstractAttributeFactory = (
  schemas = [],
  components = {}
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
      return this.attributeInfo?.schemas?.set
        || schemas[this.attributeInfo.type]
        || schemas.fallback
        || { is: 'div', text: `${this.attributeInfo.title} need [SET] schema` };
    },

    internalSchemaData() {
      const value = this.schemaData.data.attributes[this.attributeId];

      // if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      //   value = isFile(this.value) ? this.value.name : this.value;
      // } else {
      //   value = this.schemaData.data.attributes[this.attributeId].value;
      // }

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
      return components;
    },

    normalisedSchema() {
      return wrapInArray(this.internalSchema);
    }
  },

  methods: {
    genAttribute() {
      return (
        <SchemaRenderer
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
