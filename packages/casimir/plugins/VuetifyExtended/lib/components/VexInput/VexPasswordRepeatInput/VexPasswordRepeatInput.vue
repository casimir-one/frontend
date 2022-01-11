<template>
  <ve-stack :gap="8" class="mb-7">
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
      />
    </validation-provider>

    <!-- repeat new password -->

    <validation-provider
      v-slot="{ errors }"
      :name="repeatPasswordLabel"
      :rules="{
        required: true,
        minMax: { min: passwordMinLentgh, max: passwordMaxLentgh },
        equal: { target: internalPassword, label:passwordLabel },
      }"
    >
      <vex-password-input
        v-model="repeatePassword"
        :label="repeatPasswordLabel"
        :error-messages="errors"
        v-bind="fieldsProps"
      />
    </validation-provider>
  </ve-stack>
</template>
<script>
  import { VeStack } from '@deip/vue-elements';
  import { VexPasswordInput } from '../VexPasswordInput';

  export default {
    name: 'VexPasswordRepeatInput',
    components: {
      VeStack,
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
          counter: true
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
