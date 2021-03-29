<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <vex-autocomplete
      v-model="internalValue"

      :label="$$label"
      :items="attribute.valueOptions"

      item-text="title"
      item-value="value"

      hide-details="auto"
      :error-messages="errors"

      :disabled="!$$isEditable"

      outlined

      v-bind="isMultipleProps"
    />
  </validation-provider>
</template>

<script>
  import { attributeSetForceArray } from '../../mixins/base';
  import { VexAutocomplete } from '@deip/vuetify-extended';

  export default {
    name: 'AttributeSelectSet',
    components: { VexAutocomplete },
    mixins: [attributeSetForceArray],

    computed: {
      isMultipleProps() {
        return {
          multiple: this.attribute.isMultiple,
          chips: this.attribute.isMultiple,
          deletableChips: this.attribute.isMultiple
        };
      }
    }
  };
</script>
