<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <v-checkbox
      v-model="internalValue"

      :label="attribute.title"

      hide-details="auto"
      :error-messages="errors"

      :disabled="!$$isEditable"

      class="ma-0"
    />
  </validation-provider>
</template>

<script>
  import { attributeSet } from '../../mixins/base';

  import { extend } from 'vee-validate';

  extend('required', {
    validate(val) {
      return !!val;
    },
    message: '{_field_} is required'
  });

  export default {
    name: 'AttributeCheckboxSet',
    mixins: [attributeSet]
  };
</script>
