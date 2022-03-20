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

  /** Control for creating password with repeat */
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
      /** Password label */
      passwordLabel: {
        type: String,
        default: 'Password'
      },
      /** Repeat password label */
      repeatPasswordLabel: {
        type: String,
        default: 'Repeat password'
      },
      /**
       * Fields props
       * @see See [text field](https://vuetifyjs.com/en/components/text-fields/)
       */
      fieldsProps: {
        type: Object,
        default: () => ({
          counter: true
        })
      },
      /** Password minimum length */
      passwordMinLentgh: {
        type: Number,
        default: 10
      },
      /** Password maximum length */
      passwordMaxLentgh: {
        type: Number,
        default: 64
      },
      /**
       * Password
       * @model
       */
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
