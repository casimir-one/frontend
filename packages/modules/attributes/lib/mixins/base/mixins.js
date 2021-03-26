import { attributesChore } from '../attributesChore';
import { pascalCase } from 'change-case';

export const attributeTypeComponent = {
  mixins: [attributesChore],

  computed: {
    attributeComponent() {
      const componentNameSplitted = this.$options.name.split(/(?=[A-Z])/);;
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

      componentNameSplitted.splice(1, 0, pascalCase(type));

      return componentNameSplitted.join('');
    }
  }
};