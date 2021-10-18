<template>
  <vex-stack :gutter="8" class="mb-7">
    <!-- new password -->

    <validation-provider
      v-slot="{ errors }"
      :name="passwordLabel"
      :rules="{
        required: true,
        minMax: { min: passwordMinLentgh, max: passwordMaxLentgh }}"
    >
      <vex-password-input
        v-model="internalPassword"
        :label="passwordLabel"
        :error-messages="errors"
        v-bind="fieldsProps"
        counter
      />
    </validation-provider>

    <!-- repeat new password -->

    <validation-provider
      v-slot="{ errors }"
      :name="repeatPasswordLabel"
      :rules="{
        required: true,
        minMax: { min: passwordMinLentgh, max: passwordMaxLentgh },
        sameAsPassword: { field: internalPassword },
      }"
    >
      <vex-password-input
        v-model="repeatePassword"
        :label="repeatPasswordLabel"
        :error-messages="errors"
        v-bind="fieldsProps"
        counter
      />
    </validation-provider>
  </vex-stack>
</template>
<script>
  import { VexStack } from '../../VexStack';
  import { VexPasswordInput } from '../VexPasswordInput';

  export default {
    name: 'VexPasswordRepeatInput',

    components: {
      VexStack,
      VexPasswordInput
    },

    model: {
      prop: 'password',
      event: 'change'
    },

    props: {
      passwordLabel: {
        type: String,
        default: 'Password'
      },

      repeatPasswordLabel: {
        type: String,
        default: 'Repeat password'
      },

      fieldsProps: {
        type: Object,
        default: () => ({
          outlined: true
        })
      },

      passwordMinLentgh: {
        type: Number,
        default: 10
      },

      passwordMaxLentgh: {
        type: Number,
        default: 64
      },

      password: {
        type: String,
        default: ''
      }

    },

    data() {
      return {
        repeatePassword: ''
      };
    },

    computed: {
      internalPassword: {
        get() {
          return this.password;
        },
        set(value) {
          this.$emit('change', value);
        }
      }
    }

  };
</script>
