<template>
  <validation-provider
    v-slot="{ errors, }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <v-textarea 
      v-model="internalValue"
      :label="$$label"

      hide-details="auto"
      :error-messages="errors"

      :disabled="!$$isEditable"

      outlined

      :name="attribute.title"
      autocomplete="off"
    />
  </validation-provider>
</template>

<script>
  import { attributeSet } from '../../mixins/base';

  export default {
    name: 'AttributeTextareaSet',
    mixins: [attributeSet]
  };
</script>
