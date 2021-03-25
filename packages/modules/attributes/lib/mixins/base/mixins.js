import { attributesChore } from '../attributesChore';
import { pascalCase } from 'change-case';

export const attributeTypeComponent = {
  mixins: [attributesChore],

  computed: {
    attributeComponent() {
      const componentName = this.$options.name;
      let type;

      if (this.type) {
        type = this.type;
      } else if (this.attribute.type) {
        type = this.attribute.type;
      } else if (this.attribute.researchAttributeId) {
        type = this.$$tenantAttributes.find(({ _id }) => _id === this.attribute.researchAttributeId).type;
      } else {
        throw new Error('Unknown attribute');
      }

      return componentName.replace('Base', pascalCase(type));
    }
  }
};